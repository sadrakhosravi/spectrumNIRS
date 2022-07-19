/*---------------------------------------------------------------------------------------------
 *  Recording Review Model.
 *  Handles the reviewing of the recorded data
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { DeviceChartManagerModel } from '../Device/DeviceChartManager';
import { RecordingDataModel } from './RecordingDataModel';
import { SavedRecordingParsedType } from '/@/workers/database/Queries/RecordingQueries';

export class RecordingReviewModel {
  /**
   * The id of the recording to review the data.
   */
  private readonly recordingSettings: SavedRecordingParsedType;
  /**
   * The device settings previously saved in the database.
   */
  private readonly devices: SavedRecordingParsedType['devices'];
  /**
   * The recording data model. Handles the parsing and loading of the recording data.
   */
  private readonly recordingDataModel: RecordingDataModel;
  /**
   * The device chart manager model.
   */
  private deviceChartManager: DeviceChartManagerModel;

  constructor(recording: SavedRecordingParsedType) {
    this.recordingSettings = recording;
    this.devices = this.recordingSettings.devices;

    // Models
    this.recordingDataModel = new RecordingDataModel(this.recordingSettings.id);
    this.deviceChartManager = new DeviceChartManagerModel(
      this.devices[0].settings.calculatedChannelNames,
      this.devices[0].settings.PDChannelNames,
      this.devices[0].settings.samplingRate
    );

    // Actions
    this.createDeviceCharts();
    this.appendData();
  }

  /**
   * Creates the device chart channels.
   */
  private createDeviceCharts() {
    this.deviceChartManager.createDeviceCharts();
  }

  /**
   * Appends the data from the recording data model to the charts.
   */
  private async appendData() {
    await this.recordingDataModel.loadData();
  }
}
