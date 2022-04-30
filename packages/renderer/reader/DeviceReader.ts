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

  constructor() {
    this.device = Beast;
    this.physicalDevice = new this.device.Device();
    this.deviceParser = new this.device.Parser();
    this.deviceInput = null;

    this.init();
  }

  public async init() {
    console.log('Waiting for device');

    // Wait for device to connect
    await this.physicalDevice.waitForDevice();

    // When the device connects
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
   * Listen for device ADC data.
   */
  private listenForDeviceData() {
    const device = this.physicalDevice.getDevice();

    device.on(BEAST_CMDs.data, this.handleDeviceData);
  }

  // Handle device ADC data.
  private handleDeviceData(data: Buffer) {
    const unPackedData = this.deviceParser.processPacket(data);
    console.log(unPackedData);
  }

  /**
   * Listens for device disconnection.
   */
  public listenForDeviceDisconnect() {
    const device = this.physicalDevice.getDevice();

    // Handles the device disconnect event
    const handleDisconnect = () => {
      ipcService.sendDeviceConnected(false);

      // Remove listeners
      device.off('disconnect', handleDisconnect);
      device.off(BEAST_CMDs.data, this.handleDeviceData);

      // Listen for connection again
      this.init();
    };

    device.on('disconnect', handleDisconnect);
  }
}

export default new DeviceReader();
