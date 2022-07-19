import type {
  DeviceSettingsType,
  IDeviceConfigParsed,
} from '../api/device-api';

/**
 * Device settings interface.
 */
export interface IDeviceSettings {
  /**
   * Parses the passed settings object.
   * Updates all necessary device classes and the physical device itself.
   */
  updateSettings(settings: DeviceSettingsType): boolean;

  /**
   * Updates the device settings from the config previously stored in the db.
   */
  updateConfig(config: IDeviceConfigParsed): void;
}
