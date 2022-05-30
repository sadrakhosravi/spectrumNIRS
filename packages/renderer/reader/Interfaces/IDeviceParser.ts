// import { DeviceADCDataType } from '../models/Types';

import type { DeviceDataTypeWithMetaData } from 'reader/api/Types';

export interface IDeviceParser {
  /**
   * Processes raw data an return the unpacked data.
   */
  processPacket: (packet: any) => DeviceDataTypeWithMetaData;

  /**
   * Sets the active PD number.
   */
  setPDNum(num: number): void;

  /**
   * @returns the buffered device data type.
   */
  getData?: { (): any };
}
