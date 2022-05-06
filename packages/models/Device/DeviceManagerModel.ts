/*---------------------------------------------------------------------------------------------
 *  Device Manager Model.
 *  Handles the logic for adding and removing devices of the current recording.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/
import { observable, action } from 'mobx';

// Models
import { DeviceModel } from './DeviceModel';
import { devices } from './Devices';

// Types
import type { DeviceInfoType } from './DeviceModel';

export class DeviceManagerModel {
  @observable private devices: DeviceModel[];

  constructor() {
    this.devices = [];
  }

  /**
   * @return an array of all devices.
   */
  public get activeDevices() {
    return this.devices;
  }

  /**
   * @returns an array of all the available devices in the software.
   */
  public get deviceList() {
    return devices;
  }

  /**
   * Initializes the class. This needs to be called first.
   */
  public init() {
    console.log('Init');
  }

  /**
   * Enables the current device by creating an instance of its type and
   * adding it to the observable collection.
   */
  @action public enableDevice(device: DeviceInfoType) {
    const deviceObj = new DeviceModel(device);
    this.devices.push(deviceObj);
  }

  /**
   * Removes the passed in device from the active list
   * and removes references to the device obj.
   */
  @action public disableDevice(device: DeviceInfoType) {
    const index = this.devices.findIndex((d) => d.id === device.id);
    if (index === -1) return;

    // Cleanup and remove device.
    this.devices[index].cleanup();
    this.devices.splice(index, 1);
  }
}
