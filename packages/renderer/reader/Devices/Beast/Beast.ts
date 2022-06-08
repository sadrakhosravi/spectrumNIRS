/**
 * Beast Device Plugin
 * @version 0.0.5
 * @author Sadra Khosravi
 */

// Import components
import { BeastPhysicalDevice } from './BeastPhysicalDevice';
import { BeastInput } from './BeastInput';
import { BeastParser } from './BeastParser';
import { BeastDeviceSettings } from './BeastDeviceSettings';
import { BeastDefaultConfig } from './BeastDefaultConfig';

// Interfaces
import { IDevice } from 'reader/api/device-api';

const Beast: IDevice = {
  Device: BeastPhysicalDevice,
  Input: BeastInput,
  Parser: BeastParser,
  Settings: BeastDeviceSettings,
  DefaultConfigs: BeastDefaultConfig,
};

export default Beast;
