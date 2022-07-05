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

// Services
import ServiceManager from '@services/ServiceManager';

// Models
import { RecordingModel } from '@models/Recording/RecordingModel';

// Types
import type { IReactionDisposer } from 'mobx';
import type { SavedRecordingType } from '../../../../sharedWorkers/database/Queries/RecordingQueries';

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
  @observable private allRecordings: SavedRecordingType[];
  /**
   * Searched recordings.
   */
  @observable protected searchedRec: SavedRecordingType[];
  /**
   * The searched string.
   */
  @observable private searchedStr: string;
  private reactions: IReactionDisposer[];

  constructor() {
    this.currRecording = null;
    this.allRecordings = [];
    this.searchedRec = [];
    this.searchedStr = '';

    this.reactions = [];

    makeObservable(this);

    this.handleCurrentRecordingChange();
  }

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
   * Sets the current active recording.
   */
  @action public setCurrentRecording(recordingId: string | null) {
    if (!recordingId) {
      this.currRecording?.cleanup();
      this.currRecording = null;
      return;
    }

    const recording = this.recordings.find((rec) => rec.id === recordingId);

    if (!recording)
      throw new Error('Cannot set the new recording. Recording not found!');

    this.currRecording = new RecordingModel(
      recording.id,
      recording.name,
      recording.description,
      recording.created_timestamp,
      recording.updated_timestamp
    );
  }

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
   * Sets the searched recordings array based on the searched text
   */
  @action public setSearchedRecordings(searchStr: string) {
    if (searchStr === undefined || searchStr === null) return;

    this.searchedStr = searchStr.toLocaleLowerCase();

    this.searchedRec = this.allRecordings.filter((recording) =>
      recording.name.toLocaleLowerCase().includes(this.searchedStr)
    );
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
  @action public async createNewRecording(name: string, description?: string) {
    appRouterVM.setAppLoading(true, true, 'Creating a new recording...', 1200);

    const record =
      await ServiceManager.dbConnection.recordingQueries.insertRecording({
        name,
        description,
        has_data: 0,
      });

    runInAction(() => {
      this.currRecording = new RecordingModel(
        record.id,
        record.name,
        record.description,
        record.created_timestamp,
        record.updated_timestamp
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
        // Navigate to the calibration page on setting the current recording.
        this.currentRecording &&
          runInAction(() =>
            appRouterVM.navigateTo(
              AppNavStatesEnum.CALIBRATION,
              true,
              false,
              'Loading Recording...',
              1000
            )
          );

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
