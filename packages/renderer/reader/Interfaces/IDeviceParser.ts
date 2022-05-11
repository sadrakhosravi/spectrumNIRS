import EventEmitter from 'events';
import { DeviceADCDataType } from 'reader/types/DeviceDataType';

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

  /**
   * The event emitter to signal when data is ready.
   */
  dataEmitter: EventEmitter;
}
