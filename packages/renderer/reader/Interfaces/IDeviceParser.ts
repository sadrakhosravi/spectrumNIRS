export interface IDeviceParser {
  /**
   * Processes raw data an return the unpacked data.
   */
  processPacket: (packet: Buffer) => any;

  /**
   * Sets the active PD number.
   */
  setPDNum(num: number): void;
}
