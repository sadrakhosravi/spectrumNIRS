import Beast from './Beast';

// Interfaces
import { IDevice, IPhysicalDevice, IDeviceParser, IDeviceInput } from '../../api/device-api';
import { BeastCmd } from './BeastCommandsEnum,';

export class BeastDeviceReader {
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
    console.log('Waiting for device');

    // Wait for device to connect
    this.physicalDevice.waitForDevice().then(() => {
      // When the device connects
      this.isDeviceConnected = true;
      // ipcService.sendDeviceConnected(true);
      this.deviceInput = new this.device.Input(this.physicalDevice.getDevice());
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
  private listenForInitialWalkthrough() {
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
    console.log(settings);
    const status = this.deviceInput?.updateSettings(settings);
    this.deviceParser.setPDNum(settings.numOfPDs);
    // ipcService.sendDeviceInputStatus(status);
    console.log(status);
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
   * Listens for device disconnection.
   */
  public listenForDeviceDisconnect() {
    const device = this.physicalDevice.getDevice();

    // Handles the device disconnect event
    const handleDisconnect = () => {
      console.log('Device disconnected ...');
      this.isDeviceConnected = false;
      // ipcService.sendDeviceConnected(false);

      // Remove listeners
      device.off('disconnect', handleDisconnect);
      device.off(BeastCmd.ADC_DATA, this.handleDeviceData);

      this.deviceParser.dataEmitter.removeAllListeners('data');

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

    this.listenForParserData();
    device.on(BeastCmd.ADC_DATA, this.handleDeviceData.bind(this));
  }

  // Handle device ADC data.
  private handleDeviceData(data: Buffer) {
    this.deviceParser.processPacket(data);
  }

  /**
   * Listens for device parser `data` event to signal when data is ready.
   */
  private listenForParserData() {
    this.deviceParser.dataEmitter.on('data', () => {
      const unPackedData = this.deviceParser.getData();
      // ipcService.sendDeviceData(unPackedData);
      self.postMessage(unPackedData);
    });
  }
}

new BeastDeviceReader();
