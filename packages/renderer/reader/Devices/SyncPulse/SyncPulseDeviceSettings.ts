import { DeviceSettingsType, IDeviceConfigParsed } from 'reader/api/device-api';
import { IDeviceSettings } from 'reader/Interfaces';

export class SyncPulseDeviceSettings implements IDeviceSettings {
  public updateSettings(_settings: DeviceSettingsType): boolean {
    throw new Error('Sync pulse device does not have any settings.');
  }

  public updateConfig(_config: IDeviceConfigParsed): void {
    throw new Error('Sync pulse device does not have any configs.');
  }
}
