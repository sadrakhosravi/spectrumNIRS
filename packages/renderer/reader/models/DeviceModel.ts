/*---------------------------------------------------------------------------------------------
 *  Device Model.
 *  Holds the device worker instance and related functions.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, makeObservable, observable } from 'mobx';

// Worker message types
import { EventFromWorkerEnum, ReaderWorkersDataType } from '../api/Types';

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
   * The data getter to pass the data to the DeviceManager parent class.
   */
  private dataGetter: (data: any) => void;
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

  // Constructor
  constructor(name: string, workerURL: URL, dataGetter: (data: any) => void) {
    this.name = name;
    this.workerURL = workerURL;
    this.dataGetter = dataGetter;

    // Observables
    this.connected = false;
    this.streaming = false;
    this.errorMessage = '';

    makeObservable(this);

    // Create the worker instance.
    this.worker = new Worker(workerURL, { type: 'module' });
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
   * Attaches worker listeners.
   */
  private init() {
    this.worker.addEventListener('message', this.handleWorkerMessage.bind(this));
  }

  /**
   * Message handler for messages from the device worker.
   */
  @action private handleWorkerMessage({ data }: { data: ReaderWorkersDataType }) {
    switch (data.event) {
      // Device data
      case EventFromWorkerEnum.DEVICE_DATA:
        this.dataGetter(data.data);
        break;

      // Connection status update
      case EventFromWorkerEnum.DEVICE_CONNECTED:
        this.connected = data.data;
        break;

      // Device connection input status
      case EventFromWorkerEnum.INPUT_STATUS:
        this.errorMessage = data.data;
        break;

      default:
        throw new Error('Command not support!');
    }
  }
}
