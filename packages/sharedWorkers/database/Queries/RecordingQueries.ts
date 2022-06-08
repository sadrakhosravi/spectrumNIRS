import { RecordingTable } from '../Tables/RecordingTable';
import type { NewRecordingType } from '../Tables/RecordingTable';

import type { DataSource } from 'typeorm';

export class RecordingQueries {
  private dataSource: DataSource;
  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  /**
   * Creates a new recording in the database.
   */
  public async createRecording(recordingData: NewRecordingType) {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(RecordingTable)
      .values({ ...recordingData })
      .execute();
  }
}
