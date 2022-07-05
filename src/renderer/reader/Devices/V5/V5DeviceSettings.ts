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

/**
 * The device settings class used to store and parse the device
 * settings.
 */
export class V5DeviceSettings implements IDeviceSettings {
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
  private readonly deviceCalculation: IDeviceCalculation;
  protected samplingRate: number;

  /**
   * The number of active PDs of the device.
   */
  @observable private activePDs: number;
  /**
   * The number of active LEDs of the device.
   */
  @observable private activeLEDs: number;
  /**
   * Current LED intensities.
   */
  @observable protected ledIntensities: number[];
  /**
   * The device pre-gain.
   */
  @observable private preGain: string;
  /**
   * The device gain value.
   */
  @observable private gain: number;

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

    this.samplingRate = 100;

    this.ledIntensities = new Array(this.numOfSupportedPDChannels).fill(0);
    this.preGain = 'HIGH';
    this.gain = 0;

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
  public setActivePDs(_activePDs: []) {
    // V5's active PDs are not configurable.
  }

  public setActiveLEDs(_activeLEDs: []) {
    // V5's active LEDs are not configurable.
  }

  /**
   * Updates the V5's device settings.
   */
  @action public updateConfig(config: IDeviceConfigParsed) {
    this.samplingRate = config.samplingRate;
    this.ledIntensities = config.LEDIntensities;
  }

  /**
   * Sends the new settings to the Beast controller
   */
  @action public updateSettings(settings: DeviceSettingsType) {
    this.ledIntensities = settings.LEDValues;

    const formattedSettings = this.parseSettings(settings.LEDValues);
    this.deviceCalculation.setLEDIntensities(settings.LEDValues);
    // Update the physical device
    const status = this.deviceInput?.sendCommand(undefined, formattedSettings);

    return status ? true : false;
  }

  /**
   * Parses the user input settings for the Beast controller.
   * @param settings the settings object to parse.
   * @returns a comma separated string to be sent to the hardware.
   */
  private parseSettings(settings: DeviceSettingsType['LEDValues']): string {
    // Format the settings as a string comma separated.
    return `${settings.join(',')},${this.preGain},${this.gain}`;
  }
}
