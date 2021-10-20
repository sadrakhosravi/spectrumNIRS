import db from 'db/models/index';

export interface IRecording {
  /**
   * Inserts the recording data to the database
   */
  insertRecordingData(data: unknown): Promise<any>;
}

/**
 * Recording logic
 */
export class Recording implements IRecording {
  patientId: number;

  constructor(patientId: number) {
    this.patientId = patientId;
    console.log('PatientId ' + this.patientId);
  }

  async insertRecordingData(data: unknown): Promise<any> {
    try {
      await db.Recording.create({
        value: data,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default Recording;
