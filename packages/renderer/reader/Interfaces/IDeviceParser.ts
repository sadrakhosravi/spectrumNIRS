import { DeviceADCDataType } from '../models/Types';

export interface IDeviceParser {
  /**
   * Processes raw data an return the unpacked data.
   */
  processPacket: (packet: Buffer) => any;

  /**
   * Sets the active PD number.
   */
  setPDNum(num: number): void;

  /**
   * @returns the buffered device data type.
   */
  getData(): DeviceADCDataType[];
}
