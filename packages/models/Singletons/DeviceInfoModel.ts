/*---------------------------------------------------------------------------------------------
 *  Device Model.
 *  Model for storing the device information
 *  SINGLETON
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { makeObservable, observable } from 'mobx';

import AllDevices from '../../renderer/reader/Devices/AllDevices';

export class DeviceInfoModel {
  /**
   * The current device information
   */
  public device: typeof AllDevices[0];
  /**
   * The name of the current device
   */
  @observable public deviceName: string;
  /**
   * The number of active PDs
   */
  @observable public activePDs: number;
  /**
   * The number of active LEDs
   */
  @observable public activeLEDs: number;
  /**
   * The total number of supported LEDs from the hardware
   */
  @observable public readonly supportedLEDNum: number[];
  /**
   * The total number of supported PDs from the hardware
   */
  @observable public readonly supportedPDNum: number[];
  constructor() {
    this.device = AllDevices[0];
    this.deviceName = this.device.device.getName();
    this.activePDs = 1;
    this.activeLEDs = 1;

    this.supportedLEDNum = new Array(this.device.device.getSupportedLEDNum())
      .fill(0)
      .map((_, i) => (_ = i + 1));
    this.supportedPDNum = new Array(this.device.device.getSupportedPDNum())
      .fill(0)
      .map((_, i) => (_ = i + 1));

    makeObservable(this);
  }
}

export default new DeviceInfoModel();
