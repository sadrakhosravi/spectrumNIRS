/*---------------------------------------------------------------------------------------------
 *  Recording Model.
 *  Logic for the current recording.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, makeObservable, observable } from 'mobx';
import ServiceManager from '@services/ServiceManager';

// Types
import type { IReactionDisposer } from 'mobx';
import type { IDisposable } from '../Base/IDisposable';

// View Models
import { DevicesViewModel } from '../../viewmodels/Device/DevicesViewModel';
import { DeviceInfoSavedType } from '../Device/api/device-api';
import { RecordingDataModel } from './RecordingDataModel';

export class RecordingModel implements IDisposable {
  /**
   * Unique id of the recording instance.
   */
  public readonly id: number;
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
  public readonly deviceManager: DevicesViewModel;
  /**
   * The recording data manager used for loading pre-collected data.
   */
  private dataModel: RecordingDataModel | null;

  /**
   * The last update timestamp
   */
  @observable protected updatedTimestamp: number;
  reactions: IReactionDisposer[];
  private _hasData: boolean;

  constructor(
    id: number,
    name: string,
    description: string | null,
    createdTS: number,
    updatedTS: number,
    sensorType: 'v5' | 'v6',
    hasData?: boolean
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdTimestamp = createdTS;

    // Models
    this.deviceManager = new DevicesViewModel();
    this.deviceManager.addDevice('Beast', sensorType);

    this.dataModel = null;

    // Observables
    this.updatedTimestamp = updatedTS;
    this._hasData = hasData || false;
    this.reactions = [];

    makeObservable(this);

    this.init();
  }

  //#region getters

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
   * If this recording has data yet.
   */
  public get hasData() {
    return this._hasData;
  }

  public set hasData(value: boolean) {
    this._hasData = value;
  }

  public get data() {
    return this.dataModel?.data;
  }

  //#endregion

  //#region setters

  //#endregion

  /**
   * Saves the recording settings and starts the data acquisition .
   */
  @action public async startRecording() {
    // Save the device settings to the database first.
    const devicesSettings: DeviceInfoSavedType[] =
      this.deviceManager.devices.map((device) => ({
        name: device.name,
        sensorType: device.sensor,
        settings: device.currConfigs,
      }));
    await ServiceManager.dbConnection.recordingQueries.updateRecordingDevices(
      devicesSettings,
      this.id
    );

    this.deviceManager.startDevices();
  }

  /**
   * Stops the data acquisition.
   */
  @action public async stopRecording() {
    this.deviceManager.stopDevices();
  }

  /**
   * Initializes the class and does the initial checks.
   */
  @action private async init() {
    setTimeout(async () => {
      if (this._hasData) await this.loadData();
    }, 1200);
  }

  @action private async loadData() {
    this.dataModel = new RecordingDataModel(this.id);
    await this.dataModel.loadData();
  }

  /**
   * Memory cleanup
   */
  public dispose() {
    try {
      this.deviceManager.cleanup();
      this.reactions.forEach((disposer) => disposer());
      this.dataModel?.dispose();
    } catch (e: any) {
      throw new Error(
        'Cannot dispose the recording model! Something went wrong. ' + e.message
      );
    }

    return true;
  }
}
