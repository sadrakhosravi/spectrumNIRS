import PhysicalDevice, { IPhysicalDevice } from './PhysicalDevice';

export interface INIRSDevice extends IPhysicalDevice {
  /**
   * @returns - the number of LEDs of the device
   */
  getNumberOfLEDs: () => number;

  /**
   * @returns - the name and location array of the PDs of the device
   */
  getPDs: () => IPDs[];

  /**
   * @returns - the number of PDs of the device
   */
  getNumberOfPD: () => number;
}

export interface IPDs {
  name: string;
  location: string;
}

/**
 * Special device class for NIRS devices
 */
class NIRSDevice extends PhysicalDevice {
  numberOfLEDs: number;
  PDs: IPDs[];
  numberOfPDs: any;

  constructor(
    name: string,
    serialNumber: string | number,
    supportedSamplingRates: number[],
    defaultSamplingRate: number,
    version: string,
    startupDelay: number,
    numberOfLEDs: number,
    PDs: IPDs[]
  ) {
    super(
      name,
      serialNumber,
      supportedSamplingRates,
      defaultSamplingRate,
      version,
      startupDelay
    );

    this.numberOfLEDs = numberOfLEDs;
    this.PDs = PDs;
    this.numberOfPDs = this.PDs.length;
  }

  /**
   * @returns - the number of LEDs of the device
   */
  public getNumberOfLEDs = () => this.numberOfLEDs;

  /**
   * @returns - the name and location array of the PDs of the device
   */
  public getPDs = () => this.PDs;

  /**
   * @returns - the number of PDs of the device
   */
  public getNumberOfPDs = () => this.numberOfPDs;
}

export default NIRSDevice;
