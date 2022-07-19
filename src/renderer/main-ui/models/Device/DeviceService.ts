/*---------------------------------------------------------------------------------------------
 *  Device Service Model.
 *  Provides functions for adding, removing, and updating devices.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { devices } from '@models/Device/Devices';

export class DeviceService {
  /**
   * @return the device object of the given device name, if exists.
   */
  public static getDeviceObj(deviceName: string) {
    return devices.find(
      (device) =>
        device.name.toLocaleLowerCase() === deviceName.toLocaleLowerCase()
    );
  }

  /**
   * Starts the device worker for the given device.
   * @throws if the device module was not found.
   */
  public static startWorker(deviceName: string): Worker {
    const deviceToStart = devices.find(
      (device) =>
        device.name.toLocaleLowerCase() === deviceName.toLocaleLowerCase()
    );
    if (!deviceToStart)
      throw new Error('Device module not found! Something went wrong.');

    return deviceToStart.createWorker();
  }
}
