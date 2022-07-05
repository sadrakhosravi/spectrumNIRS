/**
 * V5 Device Plugin
 * @version 0.5.0
 * @author Sadra Khosravi
 */

// Import components
import { V5PhysicalDevice } from './V5PhysicalDevice';
import { V5Input } from './V5Input';
import { V5Parser } from './V5Parser';
import { V5DeviceSettings } from './V5DeviceSettings';
import { V5DefaultConfig } from './V5DefaultConfig';

// Interfaces
import { IDevice } from '../../api/device-api';

const V5: IDevice = {
  Device: V5PhysicalDevice,
  Input: V5Input,
  Parser: V5Parser,
  Settings: V5DeviceSettings,
  DefaultConfigs: V5DefaultConfig,
};

export default V5;
