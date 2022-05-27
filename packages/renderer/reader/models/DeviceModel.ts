/*---------------------------------------------------------------------------------------------
 *  Device Model.
 *  Holds the device worker instance and related functions.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { readerIPCService } from '../ReaderIPCService';

// Device api
import { sendMessageToDeviceWorker } from '../api/device-api';

// Worker message types
import {
  EventFromWorkerEnum,
  EventFromDeviceToWorkerEnum,
  EventFromWorkerType,
} from '../api/Types';

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
    sendMessageToDeviceWorker(this.worker, EventFromDeviceToWorkerEnum.START);
  }

  /**
   * Closes the device and removes all listeners.
   */
  public stopDevice() {
    sendMessageToDeviceWorker(this.worker, EventFromDeviceToWorkerEnum.STOP);
  }

  /**
   * Removes the device and its worker
   */
  public removeDevice() {
    sendMessageToDeviceWorker(this.worker, EventFromDeviceToWorkerEnum.STOP);

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
  public sendGetDataRequest() {
    sendMessageToDeviceWorker(this.worker, EventFromDeviceToWorkerEnum.GET_DATA);
  }

  // /**
  //  * Sends the device info the UI thread.
  //  */
  // public setDeviceInfo() {
  //   if (!this.info) return;
  //   readerIPCService.sendToUI(DeviceChannels.DEVICE_INFO, toJS(this.info));
  // }

  /**
   * Sends the updated settings to the worker device.
   */
  public updateSettings(settings: any) {
    console.log(settings);
    sendMessageToDeviceWorker(this.worker, EventFromDeviceToWorkerEnum.SETTINGS_UPDATE, settings);
  }

  /**
   * Attaches worker listeners.
   */
  private init() {
    this.worker.addEventListener('message', this.handleWorkerMessage.bind(this));
  }

  /**
   * Memory and listeners cleanup.
   */
  private cleanup() {
    // Dispose reactions
    this.reactions.forEach((reaction) => reaction());

    // Dispose listeners
    this.worker.removeEventListener('message', this.handleReactions);

    // Terminate the worker
    this.worker.terminate();
    //@ts-ignore
    this.worker = null;
  }

  /**
   * Sends the device data to the UI process through IPC.
   */
  private sendDataToUI(data: any) {
    readerIPCService.sendToUI(DeviceChannels.DEVICE_DATA + this.name, data);
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

  /**
   * Message handler for messages from the device worker.
   */
  @action private handleWorkerMessage({ data }: { data: EventFromWorkerType }) {
    switch (data.event) {
      // Device data
      case EventFromWorkerEnum.DEVICE_DATA:
        this.sendDataToUI(data.data);
        break;

      // Connection status update
      case EventFromWorkerEnum.DEVICE_CONNECTION_STATUS:
        this.connected = data.data;
        break;

      // Device connection input status
      case EventFromWorkerEnum.INPUT_STATUS:
        this.errorMessage = data.data;
        break;

      // Device info object
      case EventFromWorkerEnum.DEVICE_INFO:
        this.setDeviceInfo(data.data);
        break;

      default:
        throw new Error('Command not support!');
    }
  }

  /**
   * Handles observable change reactions.
   */
  private handleReactions() {
    const connectionStatusReactionDisposer = reaction(
      () => this.connected,
      () => {
        readerIPCService.sendToUI(DeviceChannels.CONNECTION_STATUS, this.connected);
      },
    );

    // Add reactions
    this.reactions.push(connectionStatusReactionDisposer);
  }
}
