import type { Socket } from 'socket.io';
import type { DeviceInfoType } from 'reader/models/Types';

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
   * @returns the complete information about the device and its channels.
   */
  getDeviceInfo(): DeviceInfoType;
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
