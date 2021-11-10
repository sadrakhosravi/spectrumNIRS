import db from 'db/models/index';

// Interfaces
import { INewPatientData } from 'interfaces/interfaces';

/**
 * Patient logic
 */
export class Patient {
  constructor() {}

  /**
   * Creates a new patient associated with the experiment in the database
   */
  public static async createNewPatient(data: INewPatientData): Promise<any> {
    try {
      const newPatient = await db.Patient.create(data, { raw: true });
      console.log(newPatient);
      const { id, name, dob, description, experimentId } =
        newPatient.dataValues;

      return { id, name, dob, description, experimentId };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default Patient;
