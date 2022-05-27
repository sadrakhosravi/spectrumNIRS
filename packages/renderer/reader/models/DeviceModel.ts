/*---------------------------------------------------------------------------------------------
 *  Device Model.
 *  Holds the device worker instance and related functions.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import * as Comlink from 'comlink';
import { IReactionDisposer, makeObservable, observable } from 'mobx';
import { readerIPCService } from '../ReaderIPCService';

// Device api
import { IDeviceReader } from '../api/device-api';

// IPC Channels
import { DeviceChannels } from '@utils/channels/DeviceChannels';

// Types
import type { DeviceInfoType } from './Types';
import ServiceManager from '../../../services/ServiceManager';

export class DeviceModel {
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
   * Observable reaction disposers
   */
  private reactions: IReactionDisposer[];

  wrappedWorker: Comlink.Remote<IDeviceReader>;

  // Constructor
  constructor(name: string, workerURL: URL) {
    this.name = name;
    this.workerURL = workerURL;

    // Observables
    this.connected = false;
    this.streaming = false;
    this.info = null;
    this.errorMessage = '';

    makeObservable(this);

    // Create the worker instance.
    this.worker = new Worker(workerURL, { type: 'module' });
    this.wrappedWorker = Comlink.wrap<IDeviceReader>(this.worker);

    // Reactions
    this.reactions = [];

    this.init();
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
    return this.info;
  }

  /**
   * Sends a command to the worker to start the device
   */
  public startDevice() {
    // sendMessageToDeviceWorker(this.worker, EventFromDeviceToWorkerEnum.START);
    this.wrappedWorker.handleDeviceStart();
  }

  /**
   * Closes the device and removes all listeners.
   */
  public async stopDevice() {
    await this.wrappedWorker.handleDeviceStop();
  }

  /**
   * Removes the device and its worker
   */
  public async removeDevice() {
    await this.wrappedWorker.handleDeviceStop();

    // Remove the info to the global state
    const currentDevices =
      ServiceManager.store.deviceStore.getDeviceStoreValue('activeDeviceModules');
    const currentDeviceIndex = currentDevices.findIndex(
      (activeDevice) => activeDevice.name === this.name,
    );
    currentDevices.splice(currentDeviceIndex, 1);

    ServiceManager.store.deviceStore.setDeviceStoreValue('activeDeviceModules', currentDevices);

    // Terminate the worker after 100ms
    setTimeout(() => {
      // Worker cleanups
      this.cleanup();
    }, 200);
  }

  /**
   * Sends a request to get the data from the worker.
   */
  public async sendGetDataRequest() {
    this.wrappedWorker.getData().then((data) => {
      readerIPCService.sendToUI(DeviceChannels.DEVICE_DATA + this.name, data);
    });
  }

  /**
   * Sends the updated settings to the worker device.
   */
  public updateSettings(settings: any) {
    this.wrappedWorker.handleDeviceSettingsUpdate(settings);
    // sendMessageToDeviceWorker(this.worker, EventFromDeviceToWorkerEnum.SETTINGS_UPDATE, settings);
  }

  /**
   * Attaches worker listeners.
   */
  private init() {
    // this.worker.addEventListener('message', this.handleWorkerMessage.bind(this));
    this.wrappedWorker.getDeviceInfo().then((info) => this.setDeviceInfo(info));
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
  private setDeviceInfo(deviceInfo: DeviceInfoType) {
    this.info = deviceInfo;

    const currentDevices =
      ServiceManager.store.deviceStore.getDeviceStoreValue('activeDeviceModules');
    currentDevices.push(deviceInfo);

    // Add the info to the global state
    ServiceManager.store.deviceStore.setDeviceStoreValue('activeDeviceModules', currentDevices);
  }
}
