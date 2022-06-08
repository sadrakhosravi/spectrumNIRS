/*---------------------------------------------------------------------------------------------
 *  Recording View Model.
 *  Uses Mobx observable pattern.
 *
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, makeObservable, observable } from 'mobx';

// Models
import { RecordingModel } from '../../models/Recording/RecordingModel';

// Types
import type { RecordingType } from '../../models/Recording/RecordingTypes';

export class RecordingViewModel {
  /**
   * The current recording instance or null.
   */
  @observable private currRecording: RecordingModel | null;
  /**
   * All recordings from the database.
   */
  @observable private allRecordings: RecordingType[];
  /**
   * Searched recordings.
   */
  @observable protected searchedRec: RecordingType[];
  /**
   * The searched string.
   */
  @observable private searchedStr: string;

  constructor() {
    this.currRecording = null;
    this.allRecordings = [];
    this.searchedRec = [];
    this.searchedStr = '';

    makeObservable(this);
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
   * Retrieves a list of all recordings in the from the database.
   */
  @action public loadAllRecordings = async () => {
    // const data = (await ServiceManager.dbConnection.all(
    //   'SELECT * FROM recordings',
    // )) as RecordingType[];
    // if (data.length === 0) return; // No recordings found
    // runInAction(() => {
    //   this.allRecordings = data;
    //   this.searchedRec = this.allRecordings;
    // });
  };

  /**
   * Sets the searched recordings array based on the searched text
   */
  @action public setSearchedRecordings(searchStr: string) {
    if (searchStr === undefined || searchStr === null) return;

    this.searchedStr = searchStr.toLocaleLowerCase();

    this.searchedRec = this.allRecordings.filter((recording) =>
      recording.name.toLocaleLowerCase().includes(this.searchedStr),
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
  @action public createNewRecording(name: string, description?: string) {
    this.currRecording = new RecordingModel(name, description || '', true);
  }
}
