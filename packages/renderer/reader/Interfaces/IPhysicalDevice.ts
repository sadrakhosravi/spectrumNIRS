import type { Socket } from 'socket.io';

export interface IPhysicalDevice {
  /**
   * @returns the current socket.io server instance.
   */
  getIO(): Socket;

  /**
   * @return the device communication instance.
   */
  getDevice(): Socket;

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
   * Waits for device connection.
   */
  waitForDevice(): Promise<boolean>;
}