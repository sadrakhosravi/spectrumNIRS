import { IPhysicalDevice } from './PhysicalDevice';
import { INIRSDevice } from './NIRSDevice';
import { Readable } from 'stream';

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
  getDeviceStream: () => Readable | null | undefined;

  /**
   * Stops the device stream
   */
  stopDeviceStream: () => boolean;

  /**
   * If the device error operates on a different channel,
   * the error messages stream can be obtained using this function
   */
  getDeviceErrorStream?: () => Readable | null | undefined;

  /**
   * If the device has a log channel (which logs the errors, updates, and other communications),
   * can be used for displaying it in the UI
   */
  getDeviceLogStream?: () => Readable | null | undefined;

  physicalDevice: INIRSDevice | IPhysicalDevice;
}

type StreamType = 'websocket' | 'stdout' | 'other-NOT Implemented';

/**
 * Device stream setup and settings
 */
class DeviceStream {}

export default DeviceStream;
