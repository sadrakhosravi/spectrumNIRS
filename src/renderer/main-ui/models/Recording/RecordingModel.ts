/*---------------------------------------------------------------------------------------------
 *  Recording Model.
 *  Logic for the current recording.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { makeObservable, observable } from 'mobx';

// Types
import type { IReactionDisposer } from 'mobx';

// View Models
import ServiceManager from '@services/ServiceManager';
import { DeviceManagerViewModel } from '/@/viewmodels/Device/DeviceManagerViewModel';

export class RecordingModel {
  /**
   * Unique id of the recording instance.
   */
  public readonly id: string;
  /**
   * The name of the recording.
   */
  public readonly name: string;
  /**
   * The name of the recording.
   */
  public readonly description: string | null;
  /**
   * The timestamp that the recording was created at.
   */
  public readonly createdTimestamp: number;
  /**
   * The device manager view model instance.
   */
  public readonly deviceManager: DeviceManagerViewModel;
  /**
   * The last update timestamp
   */
  @observable protected updatedTimestamp: number;
  reactions: IReactionDisposer[];

  constructor(
    id: string,
    name: string,
    description: string | null,
    createdTS: number,
    updatedTS: number
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdTimestamp = createdTS;

    this.deviceManager = new DeviceManagerViewModel();

    // Observables
    this.updatedTimestamp = updatedTS;
    this.reactions = [];

    makeObservable(this);

    this.getCurrRecordingDeviceSettings();
  }

  /**
   * The data that the recording was created.
   */
  public get dateCreated() {
    return this.createdTimestamp;
  }

  /**
   * The last update time stamp.
   */
  public get lastUpdate() {
    return this.updatedTimestamp;
  }

  /**
   * Retrieves the device settings from the database if available.
   */
  private async getCurrRecordingDeviceSettings() {
    const devices =
      await ServiceManager.dbConnection.recordingQueries.selectRecordingDevices(
        this.id
      );

    console.log(devices);
  }

  /**
   * Memory cleanup
   */
  public cleanup() {
    this.deviceManager.cleanup();
    this.reactions.forEach((disposer) => disposer());
  }
}
