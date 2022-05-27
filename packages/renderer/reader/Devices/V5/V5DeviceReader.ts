/*---------------------------------------------------------------------------------------------
 *  Beast Device Reader Module.
 *  Runs in a web worker.
 *  Has global.gc() access.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import * as Comlink from 'comlink';

// V5 device module
import V5 from './V5';

// Interfaces
import {
  IDevice,
  IPhysicalDevice,
  IDeviceParser,
  IDeviceInput,
  sendDataToProcess,
  IDeviceReader,
  DeviceDataTypeWithMetaData,
} from '../../api/device-api';

// Worker data types
import { EventFromWorkerEnum } from '../../api/Types';

import { ChildProcessWithoutNullStreams } from 'child_process';
import AccurateTimer from '@utils/helpers/AccurateTimer';

export class V5DeviceReader implements IDeviceReader {
  /**
   * The device classes
   */
  private device: IDevice;
  private physicalDevice: IPhysicalDevice;
  protected deviceParser: IDeviceParser;
  private deviceInput: IDeviceInput | null;

  protected isDeviceConnected: boolean;

  public readonly gcInterval: AccurateTimer;
  public readonly internalBuffer: DeviceDataTypeWithMetaData[];

  constructor() {
    this.device = V5;
    this.physicalDevice = new this.device.Device();
    this.deviceParser = new this.device.Parser();
    this.deviceInput = null;

    this.gcInterval = new AccurateTimer(this.handleGarbageCollection.bind(this), 20000);

    this.internalBuffer = [];
    this.isDeviceConnected = false;

    this.init();
  }

  /**
   * Initializes the device reader and waits for device connection
   */
  public async init() {
    this.deviceInput = new this.device.Input();
    console.log('Waiting for device');
  }

  /**
   * Sends the updated settings to the device.
   * @param settings
   */
  public handleDeviceSettingsUpdate(settings: any) {
    console.log('Settings Update from Comlink');
    this.deviceParser.setPDNum(settings.numOfPDs);

    const status = this.deviceInput?.updateSettings(settings);
    if (!status) return false;

    return status;
  }

  /**
   * Sends a signal to the device to start sending/recording data.
   */
  public async handleDeviceStart() {
    console.log('Starting Device...');
    // Spawn the device first
    (this.physicalDevice.spawnDevice as () => ChildProcessWithoutNullStreams)();

    this.listenForDeviceData();
    this.gcInterval.start();
  }

  /**
   * Sends a signal to device to stop sending/recording data.
   */
  public handleDeviceStop() {
    console.log('Stopping Device...');
    this.gcInterval.stop();
    (this.physicalDevice.cleanup as any)();
  }

  /**
   * Sends the parsed buffer from the device to the reader process.
   */
  public getData(): DeviceDataTypeWithMetaData[] {
    return this.internalBuffer.splice(0);
  }

  /**
   * Listens for device disconnection.
   */
  public listenForDeviceDisconnect() {
    const device = this.physicalDevice.getDevice();

    // Handles the device disconnect event
    const handleDisconnect = () => {
      console.log('Device disconnected ...');
      this.isDeviceConnected = false;

      // Inform the process
      sendDataToProcess(EventFromWorkerEnum.DEVICE_CONNECTION_STATUS, false);

      // Listen for connection again
      this.init();
    };

    device.on('disconnect', handleDisconnect);
  }

  /**
   * Sends the device info object to the reader process.
   */
  public getDeviceInfo() {
    // sendDataToProcess(EventFromWorkerEnum.DEVICE_INFO, info);
    return this.physicalDevice.getDeviceInfo();
  }

  public checkData() {
    console.log(this.internalBuffer.length);
  }

  /**
   * Listen for device ADC data.
   */
  public listenForDeviceData() {
    const device = this.physicalDevice.getDevice() as ChildProcessWithoutNullStreams;
    device.stdout.on('data', this.handleDeviceData.bind(this));
  }

  /**
   * Parses the device data and stores it in the internal buffer.
   */
  public handleDeviceData(data: Buffer) {
    this.internalBuffer.push(this.deviceParser.processPacket(data));

    // Check for memory leaks.
    // If the condition if true, something has gone wrong.
    if (this.internalBuffer.length > 30) {
      this.internalBuffer.length = 0;
    }
  }

  /**
   * Handles garbage collection
   */
  public handleGarbageCollection() {
    //@ts-ignore
    global.gc();
  }
}

// Beast reader instance.
const v5DeviceReader = new V5DeviceReader();
Comlink.expose(v5DeviceReader);
