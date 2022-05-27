/*---------------------------------------------------------------------------------------------
 *  Beast Device Reader Module.
 *  Runs in a web worker.
 *  Has global.gc() access.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import * as Comlink from 'comlink';
import Beast from './Beast';

// Interfaces
import type { Socket } from 'socket.io';
import {
  IDevice,
  IPhysicalDevice,
  IDeviceParser,
  IDeviceInput,
  IDeviceReader,
  DeviceDataTypeWithMetaData,
  // IDeviceReader,
} from '../../api/device-api';
import { BeastCmd } from './BeastCommandsEnum,';
import AccurateTimer from '@utils/helpers/AccurateTimer';

export class BeastDeviceReader implements IDeviceReader {
  /**
   * The device classes
   */
  private device: IDevice;
  private physicalDevice: IPhysicalDevice;
  private deviceInput: IDeviceInput | null;
  protected deviceParser: IDeviceParser;
  private isDeviceConnected: boolean;

  public readonly gcInterval: AccurateTimer;
  public readonly internalBuffer: DeviceDataTypeWithMetaData[];

  constructor() {
    this.device = Beast;
    this.physicalDevice = new this.device.Device();
    this.deviceParser = new this.device.Parser();
    this.deviceInput = null;
    this.isDeviceConnected = false;

    this.gcInterval = new AccurateTimer(this.handleGarbageCollection.bind(this), 25 * 1000);
    this.internalBuffer = [];

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

      // Inform the process
      // sendDataToProcess(EventFromWorkerEnum.DEVICE_CONNECTION_STATUS, true);

      this.deviceInput = new this.device.Input(this.physicalDevice.getDevice() as Socket);
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

    setTimeout(() => {
      this.deviceInput?.updateSettings({
        LEDValues: [92, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 75, 76],
        numOfLEDs: 15,
        numOfPDs: 7,
      });
    }, 1500);
  }

  /**
   * Sends the updated settings to the device.
   * @param settings
   */
  public handleDeviceSettingsUpdate(settings: any) {
    this.deviceParser.setPDNum(settings.numOfPDs);

    const status = this.deviceInput?.updateSettings(settings);
    if (!status) return false;
    return status;
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
    this.internalBuffer.push(this.deviceParser.processPacket(data));

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
