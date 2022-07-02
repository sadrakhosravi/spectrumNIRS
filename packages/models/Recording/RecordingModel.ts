/*---------------------------------------------------------------------------------------------
 *  Recording Model.
 *  Logic for the current recording.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { makeObservable, observable, reaction, toJS } from 'mobx';

// Types
import type { IReactionDisposer } from 'mobx';

// View Models
import { deviceManagerVM } from '../../viewmodels/VMStore';
import ServiceManager from '../../services/ServiceManager';

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
   * The devices used in the recording.
   */
  @observable private devices: any[];
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
    updatedTS: number,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdTimestamp = createdTS;

    // Observables
    this.updatedTimestamp = updatedTS;

    this.devices = [];

    this.reactions = [];

    makeObservable(this);

    this.getDeviceSettings();
    this.handleDeviceChangeReaction();
  }

  /**
   * All the devices in the recording.
   */
  public get allDevices() {
    return this.devices;
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
  private async getDeviceSettings() {
    const devices = await ServiceManager.dbConnection.recordingQueries.selectRecordingDevices(
      this.id,
    );

    console.log(devices);
  }

  private handleDeviceChangeReaction() {
    const deviceChangeReaction = reaction(
      () => deviceManagerVM.activeDeviceProxies.length,
      () => {
        console.log(toJS(deviceManagerVM.activeDevices));
      },
    );

    return deviceChangeReaction;
  }
}
