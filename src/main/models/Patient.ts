import { getConnection } from 'typeorm';
import { PatientsEntity } from '@electron/paths';
const { Patients } = require(PatientsEntity);

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
      const _newPatient = new Patients();
      Object.assign(_newPatient, data);
      const newPatient = await _newPatient.save();
      return {
        ...newPatient,
        createdAt: newPatient.createdAt.toString(),
        updatedAt: newPatient.updatedAt.toString(),
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public static async getAllPatient(experimentId: number): Promise<any> {
    try {
      return await getConnection()
        .createQueryBuilder()
        .select()
        .from('Patients', '')
        .where('experimentId = :experimentId', { experimentId })
        .orderBy({ updatedAt: 'DESC' })
        .getRawMany();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default Patient;
