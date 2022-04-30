import Beast from './Devices/Beast/Beast';

// Interfaces
import { IDevice, IPhysicalDevice, IDeviceParser, IDeviceInput } from './api/device-api';
import { readerIPCService as ipcService } from './ReaderIPCService';

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
    ipcService.sendDeviceConnected(true);
    this.deviceInput = new this.device.Input(this.physicalDevice.getDevice());

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
   * Listens for device disconnection
   */
  public listenForDeviceDisconnect() {
    const device = this.physicalDevice.getDevice();

    // Handles the device disconnect event
    const handleDisconnect = () => {
      ipcService.sendDeviceConnected(false);
      device.off('disconnect', handleDisconnect);
      this.init();
    };

    device.on('disconnect', handleDisconnect);
  }
}
