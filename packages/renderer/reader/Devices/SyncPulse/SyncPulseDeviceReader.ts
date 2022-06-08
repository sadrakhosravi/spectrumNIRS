/*---------------------------------------------------------------------------------------------
 *  Beast Device Reader Module.
 *  Runs in a web worker.
 *  Has global.gc() access.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import * as Comlink from 'comlink';
import SyncPulse from './SyncPulse';

// Interfaces
import {
  IDevice,
  IPhysicalDevice,
  IDeviceParser,
  IDeviceInput,
  IDeviceReader,
  DeviceDataTypeWithMetaData,
  IDeviceConfigParsed,
  // IDeviceReader,
} from '../../api/device-api';

// Worker data types

import { ChildProcessWithoutNullStreams } from 'child_process';
import AccurateTimer from '@utils/helpers/AccurateTimer';
import { serialize } from 'v8';

export class SyncPulseDeviceReader implements IDeviceReader {
  /**
   * The device classes
   */
  private device: IDevice;
  private physicalDevice: IPhysicalDevice;
  protected deviceInput: IDeviceInput | null;
  protected deviceParser: IDeviceParser;
  protected isDeviceConnected: boolean;

  public readonly gcInterval: AccurateTimer;
  public readonly internalBuffer: DeviceDataTypeWithMetaData[];

  constructor() {
    this.device = SyncPulse;
    this.physicalDevice = new this.device.Device();
    this.deviceParser = new this.device.Parser();
    this.deviceInput = null;
    this.isDeviceConnected = false;

    this.gcInterval = new AccurateTimer(this.handleGarbageCollection.bind(this), 60 * 1000);
    this.internalBuffer = [];

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
   * @returns the default configuration of the device.
   */
  public getDefaultConfig() {
    return this.device.DefaultConfigs;
  }

  public setDeviceConfig(deviceConfig: IDeviceConfigParsed): void {
    console.log(deviceConfig);
  }

  /**
   * Sends the updated settings to the device.
   * @param settings
   */
  public handleDeviceSettingsUpdate(_settings: any) {
    throw new Error('Sync pulse does not have any settings to update!');
    return false;
  }

  /**
   * Sends a signal to the device to start sending/recording data.
   */
  public handleDeviceStart() {
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
  public getData(): Buffer {
    return serialize(this.internalBuffer.splice(0));
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

      // Listen for connection again
      this.init();
    };

    device.on('disconnect', handleDisconnect);
  }

  /**
   * Sends the device info object to the reader process.
   */
  public getDeviceInfo() {
    return this.physicalDevice.getDeviceInfo();
  }

  /**
   * Listen for device ADC data.
   */
  public listenForDeviceData() {
    const device = this.physicalDevice.getDevice() as ChildProcessWithoutNullStreams;

    device.stdout.on('data', this.handleDeviceData.bind(this));
  }

  // Handle device ADC data.
  public handleDeviceData(data: Buffer) {
    this.internalBuffer.push(this.deviceParser.processPacket(data));

    // Check for memory leaks
    // If the condition is true, something has gone wrong.
    if (this.internalBuffer.length > 30) {
      this.internalBuffer.length = 0;
    }
  }

  /**
   * Calls the `global.gc` to force garbage collection.
   */
  public handleGarbageCollection(): void {
    //@ts-ignore
    global.gc();
  }
}

// Beast reader instance.
const syncPulseReader = new SyncPulseDeviceReader();
Comlink.expose(syncPulseReader);
