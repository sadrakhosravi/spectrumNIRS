import type { Socket } from 'socket.io';
import type { DeviceInfoType } from '../api/Types';
import { ChildProcessWithoutNullStreams } from 'child_process';

export interface IPhysicalDevice {
  /**
   * @returns the maximum number of supported LEDs
   */
  getSupportedLEDNum(): number;
  /**
   * @returns the maximum supported number of PDs
   */
  getSupportedPDNum(): number;
  /**
   * @returns the ADC resolution without the reserved bits.
   */
  getADCResolution(): number;
  /**
   * @returns the DAC resolution without the reserved bits.
   */
  getDACResolution(): number;
  /**
   * @returns the calculated channel names.
   */
  getCalculatedChannelNames(): string[];
  /**
   * @returns the PD channel names.
   */
  getPDChannelNames(): string[];
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
