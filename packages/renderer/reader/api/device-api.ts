import {
  IPhysicalDevice,
  INIRSDevice,
  IDeviceParser,
  IDeviceStream,
  IDeviceInput,
} from '../Interfaces';

export type {
  IPhysicalDevice,
  INIRSDevice,
  IDeviceParser,
  IDeviceStream,
  IDeviceInput,
} from '../Interfaces';

/**
 * The device plugin interface.
 * Each device should export an object containing all the classes implemented.
 * @version 0.1.0
 */
export interface IDevice {
  Device: IPhysicalDevice | INIRSDevice;
  Stream: IDeviceStream;
  Parser: IDeviceParser;
  Input: IDeviceInput;
}
