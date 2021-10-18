import db from 'db/models/index';

interface IPatient {}

/**
 * Patient logic
 */
export class Patient implements IPatient {
  constructor() {}

  /**
   * Creates a new patient associated with the experiment in the database
   */
  public static async createNewPatient(data: unknown): Promise<any> {
    try {
      return await db.Patient.create(data);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default Patient;
