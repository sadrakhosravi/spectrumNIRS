import {
  IPhysicalDevice,
  INIRSDevice,
  IDeviceParser,
  IDeviceInput,
  IDeviceSettings,
  IDeviceCalculation,
  IDeviceConfig,
} from '../Interfaces';

export type {
  IPhysicalDevice,
  INIRSDevice,
  IDeviceParser,
  IDeviceStream,
  IDeviceInput,
  IDeviceReader,
  IDeviceCalculation,
  IDeviceSettings,
  IDeviceConfig,
  IDeviceConfigParsed,
} from '../Interfaces';

export type { DeviceDataTypeWithMetaData, DeviceADCDataType } from './Types';

import type { DeviceInfoType } from './Types';

type Device<I> = new () => I;
type Input<I> = new (io?: any) => I;
type Parser<I> = new () => I;
type Settings<I> = new (
  physicalDevice: IPhysicalDevice,
  deviceInput: IDeviceInput,
  deviceParser: IDeviceParser,
  deviceCalculation: IDeviceCalculation,
) => I;

/**
 * The device plugin interface.
 * Each device should export an object containing all the classes implemented.
 * @version 0.2.0
 */
export interface IDevice {
  Device: Device<INIRSDevice | IPhysicalDevice>;
  Parser: Parser<IDeviceParser>;
  Input: Input<IDeviceInput>;
  Settings: Settings<IDeviceSettings>;
  DefaultConfigs: IDeviceConfig;
}

/** Device settings type */
export type DeviceSettingsType = {
  numOfLEDs: number;
  numOfPDs: number;
  LEDValues: number[];
};

/** The device info to be saved and retrieved from the database. */
export type DeviceInfoSavedType = DeviceInfoType &
  DeviceSettingsType & {
    samplingRate: number;
    activeLEDs: boolean[];
    activePDs: boolean[];
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
export const sendMessageToDeviceWorker = (worker: Worker, message?: any) => {
  worker.postMessage({ event, data: message });
};
