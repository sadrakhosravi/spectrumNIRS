import { Readable, Transform } from 'stream';

export interface IDeviceParser extends Transform {
  parse: (stream: Readable) => void;
}

/**
 * The parse used to parse the stream data coming in from the device
 */
class DeviceParser {
  constructor() {}
}

export default DeviceParser;
