/*---------------------------------------------------------------------------------------------
 *  Device Model.
 *  Holds the device worker instance and related functions.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import * as Comlink from 'comlink';
import {
  action,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
  runInAction,
  toJS,
} from 'mobx';
import ServiceManager from '../../../services/ServiceManager';

// Device api
import {
  DeviceSettingsType,
  IDeviceConfig,
  IDeviceConfigParsed,
  IDeviceReader,
} from '../api/device-api';

// Types
import type { DeviceInfoType } from '../api/Types';

export class DeviceModel {
  /**
   * The id of the device used to register in the db.
   */
  public readonly id: number;
  /**
   * The name of the device.
   */
  public readonly name: string;
  /**
   * The URL of the device worker module.
   */
  public readonly workerURL: URL;
  /**
   * The worker instance of the device.
   */
  private worker: Worker;
  /**
   * The device connection state.
   */
  @observable private connected: boolean;
  /**
   * The device streaming state.
   */
  @observable private streaming: boolean;
  /**
   * The error message sent by the device worker.
   */
  @observable protected errorMessage: string;
  /**
   * The device information object.
   */
  @observable private info: DeviceInfoType | null;
  /**
   * The current device configuration observable object.
   */
  @observable private deviceConfig: IDeviceConfig & { id: number };
  /**
   * Observable reaction disposers
   */
  private reactions: IReactionDisposer[];
  /**
   * The Comlink wrapped worker instance.
   */
  private wrappedWorker: Comlink.Remote<IDeviceReader>;
  /**
   * The message port used to transfer owner ship of the data buffer.
   */
  private ports: MessageChannel;

  // Constructor
  constructor(id: number, name: string, workerURL: URL) {
    this.id = id;
    this.name = name;
    this.workerURL = workerURL;

    // Observables
    this.connected = false;
    this.streaming = false;
    this.info = null;
    this.errorMessage = '';

    // Assign a default config object for observables to register properly.
    this.deviceConfig = {
      name: '',
      description: '',
      deviceId: 0,
      id: 0,
      settings: {
        LEDIntensities: [],
        activeLEDs: [],
        activePDs: [],
        deviceCalibrationFactor: 1,
        deviceGain: 0,
        devicePreGain: 'HIGH',
        samplingRate: 100,
        softwareGain: 1,
      },
    };

    makeObservable(this);

    // Create the worker instance.
    this.worker = new Worker(workerURL, { type: 'module' });
    this.wrappedWorker = Comlink.wrap<IDeviceReader>(this.worker);

    // Reactions
    this.reactions = [];

    // Instead of using IPC that serializes the data again,
    // transfer ownership of the object to other context using message ports.
    this.ports = new MessageChannel();
    this.ports.port1.start();
  }

  /**
   * Device connection status
   */
  public get isConnected() {
    return this.connected;
  }

  /**
   * Device streaming status.
   */
  public get isStreaming() {
    return this.streaming;
  }

  /**
   * The device information object.
   */
  public get deviceInfo() {
    return toJS(this.info);
  }

  /**
   * Attaches worker listeners.
   */
  public async init() {
    // Init Reactions after the initial checks
    this.handleConfigChangeReaction();

    // Check for device configs and set the active config to the device.
    await this.checkOrRegisterDeviceConfig();

    const info = await this.wrappedWorker.getDeviceInfo();
    this.setDeviceInfo(info);
  }

  /**
   * Checks and applies device configs from the database.
   */
  @action public async checkOrRegisterDeviceConfig() {
    const activeConfig = await ServiceManager.dbConnection.deviceQueries.selectActiveDeviceConfig(
      this.id,
    );
    // If no configs found, insert the default config
    if (!activeConfig) {
      const defaultConfig = await this.wrappedWorker.getDefaultConfig();
      await ServiceManager.dbConnection.deviceQueries.insertConfig(defaultConfig, this.id, true);
      return;
    }
    // Set the current config - the reaction will save and apply it to the device.
    runInAction(() => (this.deviceConfig = activeConfig as IDeviceConfig & { id: number }));
  }

  /**
   * Applies the saved configuration to the device/controller.
   */
  public async applySavedConfig() {
    await this.wrappedWorker.setDeviceConfig(this.deviceConfig?.settings as IDeviceConfigParsed);
  }

  /**
   * Sends a command to the worker to start the device
   */
  public startDevice() {
    // sendMessageToDeviceWorker(this.worker, EventFromDeviceToWorkerEnum.START);
    this.wrappedWorker.handleDeviceStart();

    const deviceSettings = this.deviceConfig?.settings as IDeviceConfigParsed;

    setTimeout(() => {
      this.updateSettings({
        LEDValues: deviceSettings.LEDIntensities,
        numOfLEDs: this.deviceInfo?.numOfChannelsPerPD as number,
        numOfPDs: this.deviceInfo?.numOfADCs as number,
      });
    }, 300);
  }

  /**
   * Closes the device and removes all listeners.
   */
  public async stopDevice() {
    await this.wrappedWorker.handleDeviceStop();
  }

  /**
   * @returns the device message port instance.
   */
  public getDevicePort() {
    return this.ports.port2;
  }

  /**
   * Removes the device and its worker
   */
  public async removeDevice() {
    this.ports.port1.close();
    this.ports.port2.close();

    await this.wrappedWorker.handleDeviceStop();

    // Terminate the worker after 100ms
    setTimeout(() => {
      // Worker cleanups
      this.cleanup();
    }, 200);
  }

  /**
   * Sends a request to get the data from the worker.
   */
  public async getDeviceData() {
    this.wrappedWorker.getData().then((data: Buffer | null) => {
      if (data === null) return;

      this.ports.port1.postMessage(data, [data.buffer]);
    });
  }

  /**
   * Sends the updated settings to the worker device.
   */
  @action public async updateSettings(settings: DeviceSettingsType) {
    await this.wrappedWorker.handleDeviceSettingsUpdate(settings);
  }

  /**
   * Updates the device config obj.
   */
  @action public updateConfig(settings: any) {
    this.deviceConfig.settings.LEDIntensities = settings.LEDValues;
  }

  /**
   * Handles the change in device config object.
   * Updates the device and the database.
   */
  public handleConfigChangeReaction() {
    const configReaction = reaction(
      () => this.deviceConfig.settings.LEDIntensities,
      async () => {
        await ServiceManager.dbConnection.deviceQueries.updateConfig(
          toJS(this.deviceConfig.settings),
          this.deviceConfig.id,
        );
      },
    );
    this.reactions.push(configReaction);
  }

  /**
   * Memory and listeners cleanup.
   */
  private cleanup() {
    // Dispose reactions
    this.reactions.forEach((reaction) => reaction());

    // Terminate the worker
    this.wrappedWorker[Comlink.releaseProxy];
    this.worker.terminate();
    //@ts-ignore
    this.worker = null;
  }

  /**
   * Sends the device information that was spawned and received from the worker
   * to the UI thread.
   */
  protected setDeviceInfo(deviceInfo: DeviceInfoType) {
    this.info = deviceInfo;
  }
}
