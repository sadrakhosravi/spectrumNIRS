import Snappy from 'snappy';
import { DBDataModel } from '@lib/dataTypes/BinaryData';

export type DBDataUnpacked = {
  ADC1: number[];
};

class DBDataParser {
  /**
   * Uncompresses and precesses blob ADC data and return JS objects
   * @param data the raw Blob data from the data
   * @returns unpacked data as JS objects array
   */
  public static parseBlobData(data: Buffer): DBDataUnpacked[] {
    const unCompressedData = Snappy.uncompressSync(data) as Buffer;
    const unpackedData = DBDataModel.fromBuffer(unCompressedData);
    return unpackedData;
  }
}

export default DBDataParser;
