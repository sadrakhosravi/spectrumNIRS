import { IPhysicalDevice } from './IPhysicalDevice';

export interface INIRSDevice extends IPhysicalDevice {
  /**
   * @returns - the number of LEDs of the device
   */
  getSupportedLEDNum: () => number;

  /**
   * @returns - the name, location, and number of channels of the PDs of the device
   */
  getSupportedPDNum: () => number;
}
