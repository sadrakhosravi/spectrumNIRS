import PhysicalDevice, { IPhysicalDevice } from './PhysicalDevice';
import { INIRSDevice } from './NIRSDevice';
import DeviceStream, { IDeviceStream } from './DeviceStream';
import DeviceInput, { IDeviceInput } from './DeviceInput';
import DeviceParser, { IDeviceParser } from './DeviceParser';
import DuplexStream, { DuplexStreamOptions } from '@lib/Stream/DuplexStream';
import Transformer, {
  TransformerOptions,
  TransformerCallback,
} from '@lib/Stream/Transformer';
import { DeviceDataType } from '@electron/models/DeviceReader/DeviceDataTypes';

// Export all device classes
export {
  PhysicalDevice,
  DeviceStream,
  DeviceInput,
  DeviceParser,
  IPhysicalDevice,
  INIRSDevice,
  IDeviceInput,
  IDeviceStream,
  IDeviceParser,
  TransformerCallback,
  DuplexStream,
  DuplexStreamOptions,
  Transformer,
  TransformerOptions,
};

//@ts-ignore
type Device<I> = new () => I;
type Input<I> = new () => I;
type Stream<I> = new (physicalDevice: INIRSDevice | IPhysicalDevice) => I;

export interface IGetDevice {
  Device: Device<INIRSDevice>;
  Parser: (chunk: any) => DeviceDataType[];
  Input: Input<IDeviceInput>;
  Stream: Stream<IDeviceStream>;
  DBParser?: (data: Uint16Array) => any;
}

export interface DeviceAPI {
  Device: INIRSDevice;
  Parser: IGetDevice['Parser'];
  Input: IDeviceInput;
  Stream: IDeviceStream;
}
