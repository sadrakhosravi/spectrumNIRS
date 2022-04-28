import { IPhysicalDevice } from './IPhysicalDevice';

export interface INIRSDevice extends IPhysicalDevice {
  /**
   * @returns - the number of LEDs of the device
   */
  getNumOfLEDs: () => number;

  /**
   * @returns - the name, location, and number of channels of the PDs of the device
   */
  getPDs: () => IPDs[];

  /**
   * @returns - the number of PDs of the device
   */
  getNumOfPDs: () => number;
}

export interface IPDs {
  name: string;
  location: string;
}
