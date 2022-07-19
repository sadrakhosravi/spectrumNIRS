/*---------------------------------------------------------------------------------------------
 *  Recording View Model.
 *  Uses Mobx observable pattern.
 *
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import {
  action,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from 'mobx';
import { ipcRenderer } from 'electron';

// Services
import ServiceManager from '@services/ServiceManager';

// Models
import { RecordingModel } from '@models/Recording/RecordingModel';

// Types
import type { IReactionDisposer } from 'mobx';
import type { SavedRecordingParsedType } from '@database/Queries/RecordingQueries';
import { DialogBoxChannels } from '@utils/channels';

// View models
import { appRouterVM, recordingVM } from '../VMStore';
import { AppNavStatesEnum } from '@utils/types/AppStateEnum';

export class RecordingViewModel {
  /**
   * The current recording instance or null.
   */
  @observable private currRecording: RecordingModel | null;
  /**
   * All recordings from the database.
   */
  @observable private allRecordings: SavedRecordingParsedType[];
  /**
   * Searched recordings.
   */
  @observable protected searchedRec: SavedRecordingParsedType[];
  /**
   * The searched string.
   */
  @observable private searchedStr: string;
  /**
   * Delete mode for recordings.
   */
  @observable private _deleteMode: boolean;
  private reactions: IReactionDisposer[];

  constructor() {
    this.currRecording = null;
    this.allRecordings = [];
    this.searchedRec = [];
    this.searchedStr = '';
    this._deleteMode = false;

    this.reactions = [];

    makeObservable(this);

    this.handleCurrentRecordingChange();
  }

  //#region getters
  /**
   * The current recording instance or null.
   */
  public get currentRecording() {
    return this.currRecording;
  }

  /**
   * All recordings from the database.
   */
  public get recordings() {
    return this.allRecordings;
  }

  /**
   * Searched recordings.
   */
  public get searchedRecordings() {
    return this.searchedRec;
  }

  /**
   * The delete mode for recordings.
   */
  public get deleteMode() {
    return this._deleteMode;
  }
  //#endregion

  //#endregion setters

  public set deleteMode(value: boolean) {
    runInAction(() => (this._deleteMode = value));
  }

  /**
   * Sets the current active recording.
   */
  @action public async openRecording(recordingId: number | null) {
    if (!recordingId) {
      this.currRecording?.dispose();
      this.currRecording = null;
      return;
    }

    const recording = this.recordings.find((rec) => rec.id === recordingId);
    if (!recording)
      throw new Error('Cannot set the new recording. Recording not found!');

    // Check for data
    const recordingData =
      await ServiceManager.dbConnection.recordingQueries.selectRecordingData(
        recordingId,
        1
      );

    // If the recording does not have any data go to the calibration and prepare for recording.
    if (recordingData.length === 0) {
      appRouterVM.navigateTo(
        AppNavStatesEnum.CALIBRATION,
        true,
        false,
        'Loading Recording...',
        1200
      );

      this.currRecording = new RecordingModel(
        recording.id,
        recording.name,
        recording.description,
        recording.created_timestamp,
        recording.updated_timestamp,
        recording.sensor
      );
    }

    // If the recording has data, load the data and go to the review page.
    if (recordingData.length !== 0) {
      appRouterVM.navigateTo(
        AppNavStatesEnum.REVIEW,
        true,
        false,
        'Loading Recording...',
        1200
      );
      this.currRecording = new RecordingModel(
        recording.id,
        recording.name,
        recording.description,
        recording.created_timestamp,
        recording.updated_timestamp,
        recording.devices[0].sensorType,
        true
      );
    }
  }

  /**
   * Sets the searched recordings array based on the searched text
   */
  @action public setSearchedRecordings(searchStr: string) {
    if (searchStr === undefined || searchStr === null) return;

    this.searchedStr = searchStr.toLocaleLowerCase();

    this.searchedRec = this.allRecordings.filter((recording) =>
      recording.name.toLocaleLowerCase().includes(this.searchedStr)
    );
  }

  //#endregion

  /**
   * Retrieves a list of all recordings in the from the database.
   */
  @action public async loadAllRecordings() {
    const recordings =
      await ServiceManager.dbConnection.recordingQueries.selectAllRecordings();
    runInAction(() => {
      this.allRecordings = recordings;
      this.searchedRec = recordings;
    });
  }

  /**
   * Deletes the given recording from the database.
   */
  public async deleteRecording(recordingId: number) {
    const msgBoxOptions: Electron.MessageBoxOptions = {
      title: 'Please confirm your selection',
      detail: 'This action is not reversible',
      message: 'Deleting recording and all its data',
      type: 'warning',
      buttons: ['Cancel', 'Confirm'],
      noLink: true,
    };
    const confirmation = await ipcRenderer.invoke(
      DialogBoxChannels.MessageBoxSync,
      msgBoxOptions
    );
    if (confirmation === 0) return;

    await ServiceManager.dbConnection.recordingQueries.deleteRecording(
      recordingId
    );

    this.loadAllRecordings();
  }

  /**
   * Removes all the recordings except the active recording from the state.
   */
  @action public clearAllRecordings() {
    this.allRecordings.length = 0;
  }

  /**
   * Creates a new recording.
   */
  @action public async createNewRecording(
    name: string,
    sensor: 'v5' | 'v6',
    description?: string
  ) {
    appRouterVM.setAppLoading(true, true, 'Creating a new recording...', 1200);

    const record =
      await ServiceManager.dbConnection.recordingQueries.insertRecording({
        name,
        sensor,
        description,
        has_data: 0,
      });

    runInAction(() => {
      this.currRecording = new RecordingModel(
        record.id,
        record.name,
        record.description,
        record.created_timestamp,
        record.updated_timestamp,
        sensor
      );
    });

    setTimeout(() => {
      runInAction(() => {
        appRouterVM.navigateTo(AppNavStatesEnum.CALIBRATION);
      });
    }, 500);
  }

  /**
   * Mobx reaction for current recording changed.
   */
  private handleCurrentRecordingChange() {
    const currentRecordingChangedReaction = reaction(
      () => this.currentRecording,
      () => {
        // Navigate to the home page on closing the recording.
        !this.currentRecording &&
          runInAction(() => {
            recordingVM.currRecording?.deviceManager.removeAllDevices();
            appRouterVM.navigateTo(
              AppNavStatesEnum.HOME,
              true,
              false,
              'Saving Recording...',
              1000
            );
          });
      }
    );

    this.reactions.push(currentRecordingChangedReaction);
  }
}
