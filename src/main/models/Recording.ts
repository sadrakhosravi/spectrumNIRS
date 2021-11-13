import db from 'db/models/index';

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
      const newRecording = await db.Recording.create(data, { raw: true });
      const { id, name, description, date, patientId } =
        newRecording.dataValues;
      return { id, name, description, date, patientId };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  /**
   * Inserts the recording data to the database in the `data` table
   * @param data - Data to be written to the database
   */
  public static insertRecordingData = async (
    data: any,
    recordingId: number
  ): Promise<any> => {
    try {
      await db.Data.create({ values: data, recordingId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}

export default Recording;
