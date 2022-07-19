import {
  DeviceSettingsType,
  IDeviceConfigParsed,
} from '@models/Device/api/device-api';
import { IDeviceSettings } from '@models/Device/Interfaces';

export class SyncPulseDeviceSettings implements IDeviceSettings {
  public updateSettings(_settings: DeviceSettingsType): boolean {
    throw new Error('Sync pulse device does not have any settings.');
  }

  public updateConfig(_config: IDeviceConfigParsed): void {
    throw new Error('Sync pulse device does not have any configs.');
  }
}
