import db from 'db/models/index';

// Interfaces
import { INewRecordingData } from 'interfaces/interfaces';

// TODO: Add interfaces for the data parameters.
export interface IRecording {
  /**
   * Inserts the recording data to the database.
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
