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
import { Transform } from 'stream';

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

export interface IGetDevice {
  Device: IPhysicalDevice | INIRSDevice;
  Parser: typeof Transform;
  Input: IDeviceInput;
  Stream: IDeviceStream;
}
