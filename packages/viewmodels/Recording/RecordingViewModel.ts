/*---------------------------------------------------------------------------------------------
 *  Recording View Model.
 *  Uses Mobx observable pattern.
 *
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, observable } from 'mobx';

// Models
import { RecordingModel } from '../../models/Recording/RecordingModel';
import { RecordingQueries } from '../../models/Recording/RecordingQueries';

export class RecordingViewModel {
  /**
   * The current recording instance or null.
   */
  @observable private currRecording: RecordingModel | null;
  /**
   * All recordings
   */
  @observable public allRecordings: any[];

  constructor() {
    this.currRecording = null;
    this.allRecordings = [];
  }

  /**
   * The current recording instance or null.
   */
  public get currentRecording() {
    return this.currRecording;
  }

  /**
   * Retrieves a list of all recordings in the from the database.
   */
  @action public async getAllRecordings() {
    const data = await RecordingQueries.getAllRecordings();
    if (data.length === 0) return; // No recordings found

    data.forEach((recording) => this.allRecordings.push(recording));
  }

  /**
   * Creates a new recording.
   */
  @action public createNewRecording() {
    this.currRecording = new RecordingModel('Example', 'Test', [], true);
  }
}
