/*---------------------------------------------------------------------------------------------
 *  Data Model Model.
 *  A model for storing devices data in memory.
 *  Singleton - Observable.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

// import { makeObservable } from 'mobx';

// Types
// import { EventEmitter } from 'node:events';
import type { DeviceModel } from '../Device/DeviceModel';

type DataType = {
  [key: string]: Float32Array;
};

export class DataModel {
  private data: DataType;
  /**
   * The maximum number of points in seconds.
   */
  private maxDataInSec: number;
  /**
   * The data event emitter.
   */
  // public readonly emitter: EventEmitter;

  constructor() {
    this.data = {};
    // this.emitter = new EventEmitter();
    this.maxDataInSec = 360; // Store up to 360 seconds in memory;

    // makeObservable(this);
  }

  /**
   * @returns the given device name data.
   */
  public getDeviceData(deviceName: string) {
    return this.data[deviceName];
  }

  /**
   * Adds a data source to the global data obj.
   */
  public addSource(device: DeviceModel) {
    const dataTypeObj: any = {};

    device.PDs.forEach((PD) => {
      dataTypeObj[PD] = {};

      device.LEDs.forEach((LED) => {
        dataTypeObj[PD][LED] = new Float32Array(device.samplingRate * this.maxDataInSec);
      });
    });

    // Add the data obj to the global data
    this.data[device.name] = dataTypeObj;
  }
}

export default new DataModel();
