import type { DeviceSettingsType, IDeviceSettings } from 'reader/api/device-api';

/**
 * Beast device settings class
 */
export class BeastDeviceSettings implements IDeviceSettings {
  public updateSettings(_settings: DeviceSettingsType): boolean {
    throw new Error('Method not implemented.');
  }
}
