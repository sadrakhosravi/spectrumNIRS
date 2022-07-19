import { action, makeObservable, observable, toJS } from 'mobx';

// Types
import type {
  DeviceSettingsType,
  IDeviceConfigParsed,
  IPhysicalDevice,
} from '../../api/device-api';

import type {
  IDeviceCalculation,
  IDeviceInput,
  IDeviceParser,
  IDeviceSettings,
} from '../../api/device-api';

import { BeastCmd } from './BeastCommandsEnum,';

/**
 * The device settings class used to store and parse the device
 * settings.
 */
export class BeastDeviceSettings implements IDeviceSettings {
  private readonly numOfSupportedPDChannels: number;
  private readonly numOfSupportedPDs: number;
  /**
   * The instance of device input class.
   */
  private readonly deviceInput: IDeviceInput;
  /**
   * The instance of the device parser class.
   */
  protected readonly deviceParser: IDeviceParser;
  /**
   * The device calculation class instance.
   */
  protected readonly deviceCalculation: IDeviceCalculation;
  protected samplingRate: number;

  /**
   * The number of active PDs of the device.
   */
  @observable private activePDs: number;
  /**
   * The number of active LEDs of the device.
   */
  @observable private activeLEDs: number;
  ledIntensities: number[];

  constructor(
    physicalDevice: IPhysicalDevice,
    deviceInput: IDeviceInput,
    deviceParser: IDeviceParser,
    deviceCalculation: IDeviceCalculation
  ) {
    this.deviceInput = deviceInput;
    this.deviceParser = deviceParser;
    this.deviceCalculation = deviceCalculation;
    this.numOfSupportedPDChannels = physicalDevice.getSupportedLEDNum();
    this.numOfSupportedPDs = physicalDevice.getSupportedPDNum();

    this.samplingRate = 1000;
    this.ledIntensities = [];
    this.activeLEDs = this.numOfSupportedPDChannels;
    this.activePDs = this.numOfSupportedPDs;

    makeObservable(this);
    this.init();
  }

  /**
   * Gets the initial settings from the database and replaces them with the
   * default setting. Also, attaches event/reaction listeners.
   */
  public init() {
    // Check the database for pre-configured settings
  }

  /**
   * @returns the active LEDs of the device.
   */
  public getActiveLEDs() {
    return toJS(this.activeLEDs);
  }

  /**
   * @returns the active LEDs of the device.
   */
  public getActivePDs() {
    return toJS(this.activePDs);
  }

  /**
   * Sets which PDs are active.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setActivePDs(_activePDs: []) {
    // V5's active PDs are not configurable.
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setActiveLEDs(_activeLEDs: []) {
    // V5's active LEDs are not configurable.
  }

  /**
   * Updates the settings based on the previously stored config.
   */
  @action public updateConfig(config: IDeviceConfigParsed): void {
    this.samplingRate = config.samplingRate;
    this.ledIntensities = config.LEDIntensities;
  }

  /**
   * Sends the new settings to the Beast controller
   */
  @action public updateSettings(settings: DeviceSettingsType) {
    // Reset the previous data
    const formattedSettings = this.parseSettings(settings);
    const status = this.deviceInput?.sendCommand(
      BeastCmd.SET_SETTINGS,
      formattedSettings
    );

    this.ledIntensities = settings.LEDValues;

    this.deviceCalculation.setLEDIntensities &&
      this.deviceCalculation.setLEDIntensities(settings.LEDValues);

    return status ? true : false;
  }

  /**
   * Parses the user input settings for the Beast controller.
   * @param settings the settings object to parse.
   * @returns the correctly formatted object to be sent to the controller.
   */
  private parseSettings(settings: DeviceSettingsType) {
    // Get the num of LEDs and PDs that will be active
    // const { numOfLEDs } = settings;

    // If less than 16 settings are sent, fix the array
    if (settings.LEDValues.length < 16) {
      const diff = 16 - settings.LEDValues.length;

      for (let i = 0; i < diff; i++) {
        settings.LEDValues.push(0);
      }
    }

    // Parse the intensities to the required hardware byte type
    const virtual_src_addr = new Array(4);

    // Format LEDs 1 to 4
    const LED1To4 =
      this.numTo8BitsBinary(settings.LEDValues[3]) +
      this.numTo8BitsBinary(settings.LEDValues[2]) +
      this.numTo8BitsBinary(settings.LEDValues[1]) +
      this.numTo8BitsBinary(settings.LEDValues[0]);

    // Add it to the final array
    virtual_src_addr[3] = parseInt(LED1To4.padEnd(32, '0'), 2);

    // Format LEDs 5 to 8
    const LED5To8 =
      this.numTo8BitsBinary(settings.LEDValues[7]) +
      this.numTo8BitsBinary(settings.LEDValues[6]) +
      this.numTo8BitsBinary(settings.LEDValues[5]) +
      this.numTo8BitsBinary(settings.LEDValues[4]);

    // Add it to the final array
    virtual_src_addr[2] = parseInt(LED5To8.padEnd(32, '0'), 2);

    // Format LEDs 9 to 12
    const LED9To12 =
      this.numTo8BitsBinary(settings.LEDValues[11]) +
      this.numTo8BitsBinary(settings.LEDValues[10]) +
      this.numTo8BitsBinary(settings.LEDValues[9]) +
      this.numTo8BitsBinary(settings.LEDValues[8]);

    // Add it to the final array
    virtual_src_addr[1] = parseInt(LED9To12.padEnd(32, '0'), 2);

    // Format LEDs 12 to 15
    const LED15To12 =
      this.numTo8BitsBinary(settings.LEDValues[15]) +
      this.numTo8BitsBinary(settings.LEDValues[14]) +
      this.numTo8BitsBinary(settings.LEDValues[13]) +
      this.numTo8BitsBinary(settings.LEDValues[12]);

    // Add it to the final array
    virtual_src_addr[0] = parseInt(LED15To12.padEnd(32, '0'), 2);

    // Create the final object for to be sent to the controller
    const dataToSend = {
      pd_num: 7, // TODO: Make it so that the user can select it.
      led_num: 15 + 1,
      virtual_src_addr_4: virtual_src_addr[0],
      virtual_src_addr_5: virtual_src_addr[1],
      virtual_src_addr_6: virtual_src_addr[2],
      virtual_src_addr_7: virtual_src_addr[3],
    };

    return dataToSend;
  }

  /**
   * @returns the 8 bits binary version of the passed number
   */
  private numTo8BitsBinary(num: number) {
    return num.toString(2).padStart(8, '0');
  }
}
