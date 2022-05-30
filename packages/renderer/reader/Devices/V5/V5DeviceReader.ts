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
  IDeviceReader,
  DeviceDataTypeWithMetaData,
  IDeviceSettings,
} from '../../api/device-api';

import { ChildProcessWithoutNullStreams } from 'child_process';
import AccurateTimer from '@utils/helpers/AccurateTimer';
import V5Calculation from './calc/V5Calculation';
import { V5ParserDataType } from './V5Parser';
import { DeviceSettingsType } from '@models/Device/DeviceModelProxy';
import { serialize } from 'v8';

export class V5DeviceReader implements IDeviceReader {
  /**
   * The device classes
   */
  private device: IDevice;
  private physicalDevice: IPhysicalDevice;
  protected deviceParser: IDeviceParser;
  protected deviceInput: IDeviceInput;

  protected isDeviceConnected: boolean;

  public readonly gcInterval: AccurateTimer;
  public readonly internalBuffer: DeviceDataTypeWithMetaData[];

  public readonly deviceCalculations: V5Calculation;
  public readonly deviceSettings: IDeviceSettings;
  dataBuff: Buffer;

  constructor() {
    this.device = V5;
    this.physicalDevice = new this.device.Device();
    this.deviceParser = new this.device.Parser();
    this.deviceInput = new this.device.Input();

    this.deviceCalculations = new V5Calculation();
    this.deviceSettings = new this.device.Settings(
      this.physicalDevice,
      this.deviceInput,
      this.deviceParser,
      this.deviceCalculations,
    );

    this.gcInterval = new AccurateTimer(this.handleGarbageCollection.bind(this), 20000);

    this.internalBuffer = [];
    this.dataBuff = Buffer.alloc(411);
    this.isDeviceConnected = false;

    this.init();
  }

  /**
   * Initializes the device reader and waits for device connection
   */
  public async init() {
    console.log('Waiting for device');

    // Initialize the device classes if needed
    this.deviceCalculations.init(this.physicalDevice.getDeviceInfo());
    this.deviceCalculations.setBatchSize(10);
  }

  /**
   * Sends the updated settings to the device.
   * @param settings
   */
  public handleDeviceSettingsUpdate(settings: DeviceSettingsType) {
    return this.deviceSettings.updateSettings(settings);
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
  public getData(): Buffer {
    this.dataBuff = serialize(this.internalBuffer.splice(0));
    return Comlink.transfer(this.dataBuff, [this.dataBuff.buffer]);
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
      // sendDataToProcess(EventFromWorkerEnum.DEVICE_CONNECTION_STATUS, false);

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
    console.log(this.dataBuff);
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
    const parsedData = this.deviceParser.processPacket(data);
    parsedData.calcData = this.deviceCalculations.processData(parsedData.data as V5ParserDataType);

    this.internalBuffer.push(parsedData);

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
