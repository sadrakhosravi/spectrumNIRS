import {
  IPhysicalDevice,
  INIRSDevice,
  IDeviceParser,
  // IDeviceStream,
  IDeviceInput,
} from '../Interfaces';

import type { Socket } from 'socket.io';
import { EventFromDeviceToWorkerEnum } from './Types';

export type {
  IPhysicalDevice,
  INIRSDevice,
  IDeviceParser,
  IDeviceStream,
  IDeviceInput,
  IDeviceReader,
} from '../Interfaces';

type Device<I> = new () => I;
type Input<I> = new (io?: Socket) => I;
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

/** Device settings type */
export type DeviceSettingsType = {
  numOfLEDs: number;
  numOfPDs: number;
  LEDValues: number[];
};

/**
 * A function for sending worker's data to the reader process.
 */
export const sendDataToProcess = (eventName: string, data: any, transfer?: Transferable[]) => {
  self.postMessage({ event: eventName, data }, { transfer });
};

/**
 * A function to send messages to the device worker.
 */
export const sendMessageToDeviceWorker = (
  worker: Worker,
  event: EventFromDeviceToWorkerEnum,
  message?: any,
) => {
  worker.postMessage({ event, data: message });
};
