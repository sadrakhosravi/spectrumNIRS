/*---------------------------------------------------------------------------------------------
 *  Beast Device Reader Module.
 *  Runs in a web worker.
 *  Has global.gc() access.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import SyncPulse from './SyncPulse';

// Interfaces
import {
  IDevice,
  IPhysicalDevice,
  IDeviceParser,
  IDeviceInput,
  sendDataToProcess,
} from '../../api/device-api';

// Worker data types
import {
  EventFromDeviceToWorkerEnum,
  EventFromDeviceToWorkerType,
  EventFromWorkerEnum,
} from '../../api/Types';
import { ChildProcessWithoutNullStreams } from 'child_process';

export class SyncPulseDeviceReader {
  /**
   * The device classes
   */
  private device: IDevice;
  private physicalDevice: IPhysicalDevice;
  private deviceInput: IDeviceInput | null;
  protected deviceParser: IDeviceParser;
  protected isDeviceConnected: boolean;

  constructor() {
    this.device = SyncPulse;
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
    this.deviceInput = new this.device.Input();
    console.log('Waiting for device');

    // // Wait for device to connect
    // this.physicalDevice.waitForDevice().then(() => {
    //   // When the device connects
    //   this.isDeviceConnected = true;

    //   // Inform the process
    //   sendDataToProcess(EventFromWorkerEnum.DEVICE_CONNECTION_STATUS, true);

    //   this.deviceInput = new this.device.Input(this.physicalDevice.getDevice() as Socket);
    //   this.listenForInitialWalkthrough();

    //   // Listen for device disconnect
    //   this.listenForDeviceDisconnect();

    //   console.log('Device Connected');
    // });
  }

  /**
   * Attaches and sends the initial walkthrough events and commands.
   */
  protected listenForInitialWalkthrough() {
    // setTimeout(() => {
    //   this.deviceInput?.updateSettings({
    //     LEDValues: [92, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 75, 76],
    //     numOfLEDs: 15,
    //     numOfPDs: 7,
    //   });
    // }, 1500);
  }

  /**
   * Sends the updated settings to the device.
   * @param settings
   */
  public handleDeviceSettingsUpdate(settings: any) {
    this.deviceParser.setPDNum(settings.numOfPDs);

    const status = this.deviceInput?.updateSettings(settings);
    if (!status) return;
  }

  /**
   * Sends a signal to the device to start sending/recording data.
   */
  public handleDeviceStart() {
    console.log('Starting Device...');

    // Spawn the device first
    (this.physicalDevice.spawnDevice as () => ChildProcessWithoutNullStreams)();

    this.listenForDeviceData();
  }

  /**
   * Sends a signal to device to stop sending/recording data.
   */
  public handleDeviceStop() {
    console.log('Stopping Device...');

    (this.physicalDevice.cleanup as any)();
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

      // Listen for connection again
      this.init();
    };

    device.on('disconnect', handleDisconnect);
  }

  /**
   * Sends the device info object to the reader process.
   */
  private sendDeviceInfo() {
    const info = this.physicalDevice.getDeviceInfo();
    sendDataToProcess(EventFromWorkerEnum.DEVICE_INFO, info);
  }

  /**
   * Listen for device ADC data.
   */
  private listenForDeviceData() {
    const device = this.physicalDevice.getDevice() as ChildProcessWithoutNullStreams;

    device.stdout.on('data', this.handleDeviceData.bind(this));
  }

  // Handle device ADC data.
  private handleDeviceData(data: Buffer) {
    this.deviceParser.processPacket(data);
  }
}

// Beast reader instance.
const syncPulseReader = new SyncPulseDeviceReader();

// Listeners from the main process.
self.addEventListener('message', ({ data }: { data: EventFromDeviceToWorkerType }) => {
  // Match the event with the function to execute.
  switch (data.event) {
    case EventFromDeviceToWorkerEnum.GET_DATA:
      syncPulseReader.emitData();
      break;

    // Start request
    case EventFromDeviceToWorkerEnum.START:
      syncPulseReader.handleDeviceStart();
      break;

    // Stop request
    case EventFromDeviceToWorkerEnum.STOP:
      syncPulseReader.handleDeviceStop();
      break;

    // Settings update request
    case EventFromDeviceToWorkerEnum.SETTINGS_UPDATE:
      syncPulseReader.handleDeviceSettingsUpdate(data.data);
      break;

    // Command did not match
    default:
      throw new Error('Command did not match!');
  }
});
