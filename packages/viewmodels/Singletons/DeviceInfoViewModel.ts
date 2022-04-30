/*---------------------------------------------------------------------------------------------
 *  Device Info View Model.
 *  Uses Mobx observable pattern.
 *  Stores all the device info.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, makeObservable, observable } from 'mobx';

class DeviceInfoViewModel {
  /**
   * Whether the device is connected or not.
   */
  @observable public isDeviceConnected: boolean;
  constructor() {
    this.isDeviceConnected = false;

    makeObservable(this);
  }

  /**
   * Sets whether the device is connected or not.
   */
  @action public setIsDeviceConnected(value: boolean) {
    this.isDeviceConnected = value;
  }
}

export const deviceInfoVM = new DeviceInfoViewModel();
