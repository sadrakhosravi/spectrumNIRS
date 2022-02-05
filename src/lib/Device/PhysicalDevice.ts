import {
  ChildProcess,
  ChildProcessWithoutNullStreams,
  spawn,
  SpawnOptionsWithoutStdio,
} from 'child_process';
import path from 'path';

export interface IPhysicalDevice {
  /**
   * Starts the physical device by spawning a device reader as a child process
   */
  startDevice: (
    options?: SpawnOptionsWithoutStdio
  ) => ChildProcessWithoutNullStreams | ChildProcess;

  /**
   * Stops the device and removes its process from the memory
   */
  stopDevice: () => boolean | boolean[];

  /**
   * @returns the current spawned process of the device
   */
  getDevice: () => ChildProcessWithoutNullStreams;

  /**
   * @returns the name of the device
   */
  getDeviceName: () => string;

  /**
   * @returns the serial number of the device
   */
  getDeviceSerialNumber: () => string;

  /**
   * @returns - the supported sampling rates of the device
   */
  getSupportedSamplingRates: () => number[];

  /**
   * @returns - the default sampling rate of the device
   */
  getDefaultSamplingRate: () => number;

  /**
   * @returns - the setting version of the device
   */
  getVersion: () => string;

  /**
   * @returns - the startup delay of the controller of the device after initialization
   */
  getStartupDelay: () => number;
}

/**
 * Physical Device information and settings
 */
class PhysicalDevice {
  name: string;
  serialNumber: string | number;
  supportedSamplingRates: number[];
  defaultSamplingRate: number;
  version: string;

  /**
   * The controller's startup delay after initialization
   */
  startupDelay: number;

  constructor(
    name: string,
    serialNumber: string | number,
    supportedSamplingRates: number[],
    defaultSamplingRate: number,
    version: string,
    startupDelay: number
  ) {
    this.name = name;
    this.serialNumber = serialNumber;
    this.supportedSamplingRates = supportedSamplingRates;
    this.defaultSamplingRate = defaultSamplingRate;
    this.version = version;
    this.startupDelay = startupDelay; // Controller startup delay
  }

  /**
   * Starts the physical device by spawning a device reader as a child process
   * @param readerPath - the pathname of the device reader
   * @returns - the spawned child process
   */
  public startDevice = (readerPath: string) => {
    return spawn(readerPath, [
      'test',
      path.join('../../resources/drivers/nirs-v5/Test1.exe'),
    ]);
  };

  /**
   * Stops the device and removes its process from the memory
   */
  public stopDevice = () => {};

  /**
   * @returns the name of the device
   */
  public getDeviceName = () => this.name;

  /**
   * @returns the serial number of the device
   */
  public getDeviceSerialNumber = () => this.serialNumber;

  /**
   * @returns - the supported sampling rates of the device
   */
  public getSupportedSamplingRates = () => this.supportedSamplingRates;

  /**
   * @returns - the default sampling rate of the device
   */
  public getDefaultSamplingRate = () => this.defaultSamplingRate;

  /**
   * @returns - the setting version of the device
   */
  public getVersion = () => this.version;

  /**
   * @returns - the startup delay of the controller of the device after initialization
   */
  public getStartupDelay = () => this.startupDelay;

  // /**
  //  * Checks the provided sampling rates and throws error if conditions are not met.
  //  */
  // private checkSamplingRates = () => {
  //   let isDefaultSamplingRate = false;
  //   this.supportedSamplingRates.forEach((samplingRate) => {
  //     // No more than 10,000 Hz sampling rate is currently accepted
  //     if (samplingRate > 10_000)
  //       throw Error('Sampling rates over 10,000 is not currently supported');

  //     // Check if the default sampling rate exist in the supported sampling rates
  //     if (this.defaultSamplingRate === samplingRate)
  //       isDefaultSamplingRate = true;

  //     // No zero or negative sampling rates
  //     if (samplingRate <= 0)
  //       throw Error(
  //         `Wrong sampling rate: ${samplingRate}. Sampling rates should be above 0.`
  //       );
  //   });

  //   if (!this.supportedSamplingRates)
  //     throw Error(
  //       'The default sampling rate should be in the supported sampling rates array'
  //     );
  // };
}

export default PhysicalDevice;
