/*---------------------------------------------------------------------------------------------
 *  Beast Device Reader Module.
 *  Runs in a web worker.
 *  Has global.gc() access.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import * as Comlink from 'comlink';
import Beast from './Beast';
import { serialize } from 'v8';

// Interfaces
import type { Socket } from 'socket.io';
import {
  IDevice,
  IPhysicalDevice,
  IDeviceParser,
  IDeviceInput,
  IDeviceReader,
  IDeviceSettings,
  DeviceDataTypeWithMetaData,
  // IDeviceReader,
} from '../../api/device-api';
import { BeastCmd } from './BeastCommandsEnum,';
import AccurateTimer from '@utils/helpers/AccurateTimer';

// Calc
import BeastCalculation from './calc/BeastCalculation';
import { BeastParserDataType } from './BeastParser';

export class BeastDeviceReader implements IDeviceReader {
  /**
   * The device classes
   */
  private device: IDevice;
  private physicalDevice: IPhysicalDevice;
  private deviceInput: IDeviceInput | null;
  protected deviceParser: IDeviceParser;

  private deviceCalculation: BeastCalculation;
  private deviceSettings: IDeviceSettings;

  private isDeviceConnected: boolean;

  public readonly gcInterval: AccurateTimer;
  public readonly internalBuffer: DeviceDataTypeWithMetaData[];
  private dataBuff: Buffer;

  constructor() {
    this.device = Beast;
    this.physicalDevice = new this.device.Device();
    this.deviceParser = new this.device.Parser();
    this.deviceInput = new this.device.Input();

    this.deviceCalculation = new BeastCalculation();
    this.deviceSettings = new this.device.Settings(
      this.physicalDevice,
      this.deviceInput,
      this.deviceParser,
      this.deviceCalculation,
    );

    this.isDeviceConnected = false;

    this.gcInterval = new AccurateTimer(this.handleGarbageCollection.bind(this), 45 * 1000);
    this.internalBuffer = [];
    this.dataBuff = Buffer.alloc(8192 * 3);

    this.init();
  }

  /**
   * Initializes the device reader and waits for device connection
   */
  public async init() {
    console.log('Waiting for device');

    // Wait for device to connect
    this.physicalDevice.waitForDevice().then(() => {
      // When the device connects
      this.isDeviceConnected = true;

      this.deviceInput?.setIO(this.physicalDevice.getDevice() as Socket);
      this.deviceCalculation.init(this.physicalDevice.getDeviceInfo());
      this.listenForInitialWalkthrough();
      this.listenForDeviceData();

      // Listen for device disconnect
      this.listenForDeviceDisconnect();

      console.log('Device Connected');
    });
  }

  /**
   * Attaches and sends the initial walkthrough events and commands.
   */
  public listenForInitialWalkthrough() {
    const device = this.physicalDevice.getDevice();

    // On 'Connection', ask for version - this is a must
    device.on(BeastCmd.CONNECTION, () => this.deviceInput?.sendCommand(BeastCmd.GET_VERSION, true));

    // On version received
    device.on(BeastCmd.SET_VERSION, (version: string) =>
      console.log('Beast Version Received: ' + version),
    );
  }

  /**
   * Sends the updated settings to the device.
   * @param settings
   */
  public handleDeviceSettingsUpdate(settings: any) {
    this.deviceParser.setPDNum(settings.numOfPDs);

    this.deviceSettings.updateSettings(settings);
    return false;
  }

  /**
   * Sends a signal to the device to start sending/recording data.
   */
  public handleDeviceStart() {
    console.log('Starting Device...');
    this.isDeviceConnected && this.deviceInput?.sendCommand(BeastCmd.START, true);
    this.gcInterval.start();
  }

  /**
   * Sends a signal to device to stop sending/recording data.
   */
  public handleDeviceStop() {
    console.log('Stopping Device...');
    this.gcInterval.stop();
    this.isDeviceConnected && this.deviceInput?.sendCommand(BeastCmd.STOP, true);
  }

  /**
   * Sends the parsed buffer from the device to the reader process.
   */
  public getData(): Buffer | null {
    if (this.internalBuffer.length === 0) return null;
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

      // Remove listeners
      device.off('disconnect', handleDisconnect);
      device.off(BeastCmd.ADC_DATA, this.handleDeviceData);

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
    const device = this.physicalDevice.getDevice();

    device.on(BeastCmd.ADC_DATA, this.handleDeviceData.bind(this));
  }

  // Handle device ADC data.
  public handleDeviceData(data: Buffer) {
    const parsedData = this.deviceParser.processPacket(data);
    parsedData.calcData = this.deviceCalculation.processData(
      parsedData.data as BeastParserDataType,
    );

    // Add the object the internal buff.
    this.internalBuffer.push(parsedData);

    // Check for memory leaks
    // If the condition is true, something has gone wrong
    if (this.internalBuffer.length > 50) {
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
const beastReader = new BeastDeviceReader();
Comlink.expose(beastReader);
