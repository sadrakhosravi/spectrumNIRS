import { getConnection } from 'typeorm';
import { Recordings } from 'db/entity/Recordings';
import { RecordingsData } from 'db/entity/RecordingsData';

// Interfaces
import { INewRecordingData } from 'interfaces/interfaces';

// TODO: Add interfaces for the data parameters.
export interface IRecording {}

/**
 * Recording logic
 */
export class Recording implements IRecording {
  currentRecording: any;

  constructor(currentRecording: any) {
    this.currentRecording = currentRecording;
  }

  /**
   * Creates a new recording record in the database.
   */
  public static createNewRecording = async (
    data: INewRecordingData
  ): Promise<any> => {
    try {
      const _newRecording = await new Recordings();
      Object.assign(_newRecording, data);
      const newRecording = await _newRecording.save();
      console.log(newRecording);

      return newRecording;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  /**
   * Retrieves all recordings related to the same patient
   * @param patientId
   */
  public static getAllRecordings = async (patientId: number): Promise<any> => {
    try {
      return await getConnection()
        .createQueryBuilder()
        .select()
        .from(Recordings, '')
        .where('patientId = :patientId', { patientId })
        .orderBy({
          updatedAt: 'DESC',
        })
        .getRawMany();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  public static checkForRecordingData = async (recordingId: number) => {
    try {
      return await getConnection()
        .createQueryBuilder()
        .select()
        .from(RecordingsData, '')
        .where('recordingId = :recordingId', { recordingId })
        .orderBy({ id: 'DESC' })
        .limit(30000)
        .getRawMany();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}

export default Recording;
