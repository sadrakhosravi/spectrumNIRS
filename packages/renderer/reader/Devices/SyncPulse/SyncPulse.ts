/**
 * Sync Pulse Device Plugin
 * @version 0.1.0
 * @author Ali Zadi | Sadra Khosravi
 */

// Import components
import { SyncPulsePhysicalDevice } from './SyncPulsePhysicalDevice';
import { SyncPulseInput } from './SyncPulseInput';
import { SyncPulseParser } from './SyncPulseParser';

// Interfaces
import { IDevice } from 'reader/api/device-api';

const SyncPulse: IDevice = {
  Device: SyncPulsePhysicalDevice,
  Input: SyncPulseInput,
  Parser: SyncPulseParser,
};

export default SyncPulse;
