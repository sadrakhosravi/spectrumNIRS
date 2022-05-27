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
  private activeDevices!: DeviceModel[];
  /**
   * The data acquisition loop accurate interval timer instance or null.
   */
  private loopInterval: AccurateTimer | null;
  /**
   * The forced garbage collection interval.
   */
  private gcInterval: AccurateTimer | null;

  constructor() {
    this.loopInterval = null;
    this.gcInterval = null;
  }

  /**
   * Starts the devices and the data acquisition loop.
   */
  public startDataAcquisition(activeDevices: DeviceModel[]) {
    this.activeDevices = activeDevices;

    // Start the loop interval
    this.loopInterval = new AccurateTimer(this.handleDataAcquisition.bind(this), 50);
    // this.gcInterval = new AccurateTimer(this.handleGarbageCollection.bind(this), 20000);

    this.loopInterval.start();
    // this.gcInterval.start();
  }

  /**
   * Stops the data acquisition loop
   */
  public stopDataAcquisitionLoop() {
    setImmediate(() => this.loopInterval?.stop);
    this.loopInterval?.stop();
    this.gcInterval?.stop();
  }

  /**
   * Runs the data acquisition loop.
   */
  private handleDataAcquisition() {
    this.activeDevices.forEach((device) => device.sendGetDataRequest());
  }

  /**
   * Handle forced garbage collection.
   */
  protected handleGarbageCollection() {
    console.log(process.getHeapStatistics());
    //@ts-ignore
    global.gc();
  }
}
