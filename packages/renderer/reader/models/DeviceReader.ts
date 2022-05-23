/*---------------------------------------------------------------------------------------------
 *  Device Reader Model.
 *  Data acquisition loop manager.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

// Types
import AccurateTimer from '@utils/helpers/AccurateTimer';
import type { DeviceModel } from './DeviceModel';

export class DeviceReader {
  /**
   * The active devices reference from the device manager model.
   */
  private readonly activeDevices: DeviceModel[];
  /**
   * The data acquisition loop accurate interval timer instance or null.
   */
  private loopInterval: AccurateTimer | null;

  constructor(activeDevices: DeviceModel[]) {
    this.activeDevices = activeDevices;
    this.loopInterval = null;
  }

  /**
   * Starts the devices and the data acquisition loop.
   */
  public startDataAcquisition() {
    // Start the loop interval
    this.loopInterval = new AccurateTimer(this.handleDataAcquisition.bind(this), 100);
    this.loopInterval.start();
  }

  /**
   * Stops the data acquisition loop
   */
  public stopDataAcquisitionLoop() {
    setImmediate(() => this.loopInterval?.stop);
    this.loopInterval?.stop();
  }

  /**
   * The data getter callback function. The parameters will hold the device data and deviceName.
   */
  public dataGetter(_data: any, deviceName: string) {
    console.log(deviceName);
  }

  /**
   * Runs the data acquisition loop.
   */
  private handleDataAcquisition() {
    this.activeDevices.forEach((device) => device.sendGetDataRequest());
  }
}
