/*---------------------------------------------------------------------------------------------
 *  Device Model.
 *  Holds the device worker instance and related functions.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import * as Comlink from 'comlink';
import { IReactionDisposer, makeObservable, observable, toJS } from 'mobx';
// import { readerIPCService } from '../ReaderIPCService';

// Device api
import { IDeviceReader } from '../api/device-api';

// IPC Channels
// import { DeviceChannels } from '@utils/channels/DeviceChannels';

// Types
import type { DeviceInfoType } from '../api/Types';

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
  /**
   * The Comlink wrapped worker instance.
   */
  wrappedWorker: Comlink.Remote<IDeviceReader>;
  /**
   * The message port used to transfer owner ship of the data buffer.
   */
  private ports: MessageChannel;

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
    const info = await this.wrappedWorker.getDeviceInfo();
    this.setDeviceInfo(info);
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
  public updateSettings(settings: any) {
    this.wrappedWorker.handleDeviceSettingsUpdate(settings);
    // sendMessageToDeviceWorker(this.worker, EventFromDeviceToWorkerEnum.SETTINGS_UPDATE, settings);
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
