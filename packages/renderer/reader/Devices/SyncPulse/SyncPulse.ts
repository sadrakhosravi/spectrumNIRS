/**
 * Sync Pulse Device Plugin
 * @version 0.2.0
 * @author Ali Zadi | Sadra Khosravi
 */

// Import components
import { SyncPulsePhysicalDevice } from './SyncPulsePhysicalDevice';
import { SyncPulseInput } from './SyncPulseInput';
import { SyncPulseParser } from './SyncPulseParser';
import { SyncPulseDeviceSettings } from './SyncPulseDeviceSettings';
import { SyncPulseDefaultConfig } from './SyncPulseDefaultConfig';

// Interfaces
import { IDevice } from 'reader/api/device-api';

const SyncPulse: IDevice = {
  Device: SyncPulsePhysicalDevice,
  Input: SyncPulseInput,
  Parser: SyncPulseParser,
  Settings: SyncPulseDeviceSettings,
  DefaultConfigs: SyncPulseDefaultConfig,
};

export default SyncPulse;
