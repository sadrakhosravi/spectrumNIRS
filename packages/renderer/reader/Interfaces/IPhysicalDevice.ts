import { ChildProcess, ChildProcessByStdio, SpawnOptionsWithoutStdio } from 'child_process';
import { Readable } from 'stream';

export interface IPhysicalDevice {
  /**
   * Starts the physical device by spawning a device reader as a child process
   */
  startDevice: (
    options?: SpawnOptionsWithoutStdio,
  ) => ChildProcessByStdio<null, Readable, Readable> | ChildProcess;

  /**
   * Stops the device and removes its process from the memory
   */
  stopDevice: () => boolean | boolean[];

  /**
   * @returns the current spawned process of the device
   */
  getDevice: () => ChildProcess;

  /**
   * @returns the name of the device
   */
  getDeviceName: () => string;

  /**
   * @returns the number of ADC channels
   */
  getADCNumOfChannels: () => number;

  /**
   * @returns the number of ADCs on the device
   */
  getNumOfADCs?: () => number;

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
