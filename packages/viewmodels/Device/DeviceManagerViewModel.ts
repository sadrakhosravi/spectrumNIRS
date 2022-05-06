/*---------------------------------------------------------------------------------------------
 *  Device Manager View Model.
 *  Uses Mobx observable pattern.
 *  UI Logic for enabling and disabling devices.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

// Models
import { DeviceManagerModel } from '../../models/Device/DeviceManagerModel';
import { devices } from '../../models/Device/Devices';

export class DeviceManagerViewModel {
  /**
   * Device manager model instance.
   */
  private model: DeviceManagerModel;

  constructor() {
    this.model = new DeviceManagerModel();

    // Enable beast by default.
    this.addDefaultDevices();
  }

  /**
   * @returns an array of active devices.
   */
  public get activeDevices() {
    return this.model.activeDevices;
  }

  /**
   * Test: Enables `Beast` device by default.
   */
  private addDefaultDevices() {
    this.model.enableDevice(devices[0]);
  }
}
