import PhysicalDevice, { IPhysicalDevice } from './PhysicalDevice';
import NIRSDevice, { INIRSDevice } from './NIRSDevice';
import DeviceStream, { IDeviceStream } from './DeviceStream';
import DeviceInput, { IDeviceInput } from './DeviceInput';
import DeviceParser, { IDeviceParser } from './DeviceParser';
import DuplexStream, { DuplexStreamOptions } from '@lib/Stream/DuplexStream';
import Transformer, {
  TransformerOptions,
  TransformerCallback,
} from '@lib/Stream/Transformer';

// Export all device classes
export {
  PhysicalDevice,
  NIRSDevice,
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

type Device<I> = new () => I;
type Input<I> = new () => I;
type Stream<I> = new (physicalDevice: INIRSDevice | IPhysicalDevice) => I;

export interface IGetDevice {
  Device: Device<IPhysicalDevice | INIRSDevice>;
  Parser: (chunk: any, dataBuf: Int32Array | SharedArrayBuffer) => Int32Array;
  Input: Input<IDeviceInput>;
  Stream: Stream<IDeviceStream>;
  DBParser?: (data: Uint16Array) => any;
}

export interface DeviceAPI {
  Device: IPhysicalDevice | INIRSDevice;
  Parser: (chunk: any, dataBuf: Int32Array | SharedArrayBuffer) => Int32Array;
  Input: IDeviceInput;
  Stream: IDeviceStream;
}
