import { IPhysicalDevice } from './PhysicalDevice';
import { INIRSDevice } from './NIRSDevice';
import { Readable } from 'stream';
import { ReadLine } from 'readline';

export interface IDeviceStream {
  /**
   * @returns the current type of the stream
   */
  getStreamType: () => StreamType;

  /**
   * @return the individual sample buffer size
   */
  getSampleBufferSize: () => number;

  /**
   * @returns the output buffer size of the data batch sent to the UI via IPC
   */
  getOutputBufferSizeToUIInBytes: () => number;

  /**
   * @returns the number of data point in a data batch
   */
  getDataBatchSize: () => number;

  /**
   *
   */
  getNumOfElementsPerDataPoint: () => number;

  /**
   * Gets the stream data from the device
   */
  getDeviceStream: () => Readable | ReadLine | null;

  /**
   * Stops the device stream
   */
  stopDeviceStream: () => boolean;

  physicalDevice: INIRSDevice | IPhysicalDevice;
}

type StreamType = 'websocket' | 'stdout' | 'other-NOT Implemented';

/**
 * Device stream setup and settings
 */
class DeviceStream {}

export default DeviceStream;
