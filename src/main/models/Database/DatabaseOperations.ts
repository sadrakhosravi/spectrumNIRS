import { DBDataModel } from '@lib/dataTypes/BinaryData';
import { DBDataUnpacked } from '../DBDataParser';
import dbConstants from './dbConstants';

const supportedSerializations = [dbConstants.serialization];
const supportedCompressions = [dbConstants.compression];

let Snappy: any;

// Loads the right snappy module for main or renderer
if (process.type === 'renderer') {
  Snappy = require('snappy-electron');
} else {
  Snappy = require('snappy');
}

/**
 * Database functions for checking the compatibility of data
 * @version 0.3.2
 */
class DatabaseOperations {
  version: string;
  serialization: string;
  compression: string;

  supportedSerializations: string[];
  supportedCompression: string[];
  constructor() {
    this.version = dbConstants.version;
    this.serialization = dbConstants.serialization;
    this.compression = dbConstants.compression;

    this.supportedSerializations = supportedSerializations;
    this.supportedCompression = supportedCompressions;
  }

  /**
   * @returns the current db version used for determining structural changes
   */
  public getVersion() {
    return this.version;
  }

  /**
   * @returns a boolean if the data is compatible with supported unpack algorithm
   */
  public checkDataCompatibility(data: any) {
    let isCompatible = true;

    // Check for compatibility
    if (!this.supportedSerializations.includes(data.serialization))
      isCompatible = false;
    if (!this.supportedCompression.includes(data.compression))
      isCompatible = false;

    return isCompatible;
  }

  /**
   * Uncompresses and precesses blob ADC data and return JS objects
   * @param data the raw Blob data from the data
   * @returns unpacked data as JS objects array
   */
  public parseData(data: Buffer): DBDataUnpacked[] {
    const unCompressedData = Snappy.uncompressSync(data) as Buffer;
    const unpackedData = DBDataModel.fromBuffer(unCompressedData);
    return unpackedData;
  }
}

export default new DatabaseOperations();
