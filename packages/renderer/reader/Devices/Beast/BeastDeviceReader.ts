/*---------------------------------------------------------------------------------------------
 *  Beast Device Reader Module.
 *  Runs in a web worker.
 *  Has global.gc() access.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import Beast from './Beast';

// Interfaces
import type { Socket } from 'socket.io';
import {
  IDevice,
  IPhysicalDevice,
  IDeviceParser,
  IDeviceInput,
  sendDataToProcess,
  IDeviceReader,
} from '../../api/device-api';
import { BeastCmd } from './BeastCommandsEnum,';

// Worker data types
import {
  EventFromDeviceToWorkerEnum,
  EventFromDeviceToWorkerType,
  EventFromWorkerEnum,
} from '../../api/Types';

export class BeastDeviceReader implements IDeviceReader {
  /**
   * The device classes
   */
  private device: IDevice;
  private physicalDevice: IPhysicalDevice;
  private deviceInput: IDeviceInput | null;
  protected deviceParser: IDeviceParser;
  private isDeviceConnected: boolean;

  constructor() {
    this.device = Beast;
    this.physicalDevice = new this.device.Device();
    this.deviceParser = new this.device.Parser();
    this.deviceInput = null;
    this.isDeviceConnected = false;

    this.init();
  }

  /**
   * Initializes the device reader and waits for device connection
   */
  public async init() {
    this.sendDeviceInfo();
    console.log('Waiting for device');

    // Wait for device to connect
    this.physicalDevice.waitForDevice().then(() => {
      // When the device connects
      this.isDeviceConnected = true;

      // Inform the process
      sendDataToProcess(EventFromWorkerEnum.DEVICE_CONNECTION_STATUS, true);

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
  }

  /**
   * Sends a signal to device to stop sending/recording data.
   */
  public handleDeviceStop() {
    console.log('Stopping Device...');
    this.isDeviceConnected && this.deviceInput?.sendCommand(BeastCmd.STOP, true);
  }

  /**
   * Sends the parsed buffer from the device to the reader process.
   */
  public emitData() {
    sendDataToProcess(EventFromWorkerEnum.DEVICE_DATA, this.deviceParser.getData());
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
  public sendDeviceInfo() {
    const info = this.physicalDevice.getDeviceInfo();
    sendDataToProcess(EventFromWorkerEnum.DEVICE_INFO, info);
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
    this.deviceParser.processPacket(data);
  }
}

// Beast reader instance.
const beastReader = new BeastDeviceReader();

// Listeners from the main process.
self.addEventListener('message', ({ data }: { data: EventFromDeviceToWorkerType }) => {
  // Match the event with the function to execute.
  switch (data.event) {
    case EventFromDeviceToWorkerEnum.GET_DATA:
      beastReader.emitData();
      break;

    // Start request
    case EventFromDeviceToWorkerEnum.START:
      beastReader.handleDeviceStart();
      break;

    // Stop request
    case EventFromDeviceToWorkerEnum.STOP:
      beastReader.handleDeviceStop();
      break;

    // Settings update request
    case EventFromDeviceToWorkerEnum.SETTINGS_UPDATE:
      beastReader.handleDeviceSettingsUpdate(data.data);
      break;

    // Command did not match
    default:
      throw new Error('Command did not match!');
  }
});
