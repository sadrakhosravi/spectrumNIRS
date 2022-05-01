import Beast from './Devices/Beast/Beast';

// Interfaces
import { IDevice, IPhysicalDevice, IDeviceParser, IDeviceInput } from './api/device-api';
import { readerIPCService as ipcService } from './ReaderIPCService';
import { BEAST_CMDs } from './Devices/Beast/enums';

export class DeviceReader {
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

  public async init() {
    console.log('Waiting for device');

    // Wait for device to connect
    await this.physicalDevice.waitForDevice();

    // When the device connects
    this.isDeviceConnected = true;
    ipcService.sendDeviceConnected(true);
    this.deviceInput = new this.device.Input(this.physicalDevice.getDevice());
    this.listenForDeviceData();

    // Listen for device disconnect
    this.listenForDeviceDisconnect();

    console.log('Device Connected');
  }

  /**
   * Sends the updated settings to the device.
   * @param settings
   */
  public handleDeviceSettingsUpdate(settings: any) {
    this.deviceInput?.updateSettings(settings);
  }

  /**
   * Sends a signal to the device to start sending/recording data.
   */
  public handleDeviceStart() {
    console.log('Starting Device...');
    this.isDeviceConnected && this.deviceInput?.sendCommand(BEAST_CMDs.start, true);
  }

  /**
   * Sends a signal to device to stop sending/recording data.
   */
  public handleDeviceStop() {
    console.log('Stopping Device...');
    this.isDeviceConnected && this.deviceInput?.sendCommand(BEAST_CMDs.stop, true);
  }

  /**
   * Listens for device disconnection.
   */
  public listenForDeviceDisconnect() {
    const device = this.physicalDevice.getDevice();

    // Handles the device disconnect event
    const handleDisconnect = () => {
      this.isDeviceConnected = false;
      ipcService.sendDeviceConnected(false);

      // Remove listeners
      device.off('disconnect', handleDisconnect);
      device.off(BEAST_CMDs.data, this.handleDeviceData);

      // Listen for connection again
      this.init();
    };

    device.on('disconnect', handleDisconnect);
  }

  /**
   * Listen for device ADC data.
   */
  private listenForDeviceData() {
    const device = this.physicalDevice.getDevice();

    device.on(BEAST_CMDs.data, this.handleDeviceData);
  }

  // Handle device ADC data.
  private handleDeviceData(data: Buffer) {
    const unPackedData = this.deviceParser.processPacket(data);
    ipcService.sendDeviceData(unPackedData);
    console.log(unPackedData);
  }
}

export default new DeviceReader();
