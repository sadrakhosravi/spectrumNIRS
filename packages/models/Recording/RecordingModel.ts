/*---------------------------------------------------------------------------------------------
 *  Recording Model.
 *  Logic for the current recording.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { nanoid } from 'nanoid';
import { observable } from 'mobx';

export class RecordingModel {
  /**
   * Unique id of the recording instance.
   */
  public readonly id: string;
  /**
   * The name of the recording.
   */
  @observable private recordingName: string;
  /**
   * The name of the recording.
   */
  @observable private recordingDescription: string;
  /**
   * The devices used in the recording.
   */
  @observable private devices: any[];
  /**
   * The timestamp that the recording was created at.
   */
  private createdTimestamp: number;
  /**
   * The last update timestamp
   */
  private lastUpdateTimestamp: number;

  constructor(name: string, description: string, devices: any[] | [], isNewRecord: boolean) {
    this.id = nanoid();
    this.recordingName = name;
    this.recordingDescription = description;
    this.devices = devices;

    this.createdTimestamp = Date.now();
    this.lastUpdateTimestamp = this.createdTimestamp;

    // Only create a record if its a new record.
    isNewRecord && this.createDatabaseRecord();
  }

  /**
   * The name of the recording.
   */
  public get name() {
    return this.recordingName;
  }

  /**
   * The description of the recording.
   */
  public get description() {
    return this.recordingDescription;
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
    return this.lastUpdateTimestamp;
  }

  /**
   * Updates the database record.
   */
  private async createDatabaseRecord() {
    // await ServiceManager.dbConnection.run(
    //   'INSERT INTO recordings VALUES(?, ?, ?, ?, ?, ?)',
    //   this.id,
    //   this.name,
    //   this.description,
    //   this.createdTimestamp,
    //   Date.now(),
    //   'Testtt',
    // );
  }
}
