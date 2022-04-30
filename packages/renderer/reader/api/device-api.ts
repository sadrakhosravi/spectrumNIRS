import {
  IPhysicalDevice,
  INIRSDevice,
  IDeviceParser,
  // IDeviceStream,
  IDeviceInput,
} from '../Interfaces';

import type { Socket } from 'socket.io';

export type {
  IPhysicalDevice,
  INIRSDevice,
  IDeviceParser,
  IDeviceStream,
  IDeviceInput,
} from '../Interfaces';

type Device<I> = new () => I;
type Input<I> = new (io: Socket) => I;
type Parser<I> = new () => I;

/**
 * The device plugin interface.
 * Each device should export an object containing all the classes implemented.
 * @version 0.1.0
 */
export interface IDevice {
  Device: Device<INIRSDevice | IPhysicalDevice>;
  // Stream: IDeviceStream;
  Parser: Parser<IDeviceParser>;
  Input: Input<IDeviceInput>;
}
