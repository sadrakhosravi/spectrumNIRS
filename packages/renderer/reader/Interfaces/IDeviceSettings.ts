import type { DeviceSettingsType } from 'reader/api/device-api';

/**
 * Device settings interface.
 */
export interface IDeviceSettings {
  /**
   * Parses the passed settings object.
   * Updates all necessary device classes and the physical device itself.
   */
  updateSettings(settings: DeviceSettingsType): boolean;
}
