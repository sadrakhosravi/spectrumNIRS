import type { Socket } from 'socket.io';
import type { DeviceInfoType } from 'reader/models/Types';
import { ChildProcessWithoutNullStreams } from 'child_process';

export interface IPhysicalDevice {
  /**
   * Spawn the device
   */
  spawnDevice?: { (): ChildProcessWithoutNullStreams };
  /**
   * Kills any spawned instances and does listener/memory cleanup.
   */
  cleanup?: { (): void };
  /**
   * @returns the current socket.io server instance.
   */
  getIO(): Socket | ChildProcessWithoutNullStreams;
  /**
   * @return the device communication instance.
   */
  getDevice(): Socket | ChildProcessWithoutNullStreams;
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
