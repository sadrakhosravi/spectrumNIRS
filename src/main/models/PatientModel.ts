import { getConnection } from 'typeorm';
// import { PatientsEntity } from '@electron/paths';
import Patients from 'db/entity/Patients';
// Interfaces
import { INewPatientData } from 'interfaces/interfaces';
import GlobalStore from '@lib/globalStore/GlobalStore';
import ExperimentModel from './ExperimentModel';

export interface IPatientData {
  createdAt: string;
  description: string;
  dob: string | Date;
  experimentId: number;
  id: number;
  name: string;
  updatedAt: string;
}

/**
 * Patient logic
 */
export class PatientModel {
  currentPatient: Patients | undefined;
  constructor() {
    this.currentPatient = undefined;
  }

  /**
   * @returns the current patient
   */
  public getCurrentPatient = () => this.currentPatient;

  /**
   * Sets the current patient data
   * @param patient - the patient to be set as the current patient
   */
  public setCurrentPatient = (patient: Patients | undefined) => {
    GlobalStore.removePatient();
    GlobalStore.removeRecording();

    this.currentPatient = patient;

    if (!this.currentPatient) {
      GlobalStore.removePatient();
      GlobalStore.removeRecording();
      return;
    }

    GlobalStore.setPatient('currentPatient', this.currentPatient);
  };

  /**
   * @param patientId the id of the patient to get the data
   * @returns the stored data of the patient
   */
  public getPatientData = async (
    patientId: number
  ): Promise<Patients | undefined> => {
    return await getConnection()
      .createQueryBuilder()
      .select()
      .from(Patients, '')
      .where(`id = ${patientId}`)
      .getRawOne();
  };

  /**
   * Creates a new patient associated with the experiment in the database
   */
  public async createNewPatient(data: INewPatientData): Promise<any> {
    try {
      const experiment = ExperimentModel.getCurrentExperiment();

      if (!experiment) return;

      const _newPatient = new Patients();
      Object.assign(_newPatient, data);
      _newPatient.experiment = experiment;

      const newPatient = await _newPatient.save();

      // Set the current experiment after successful creation
      this.setCurrentPatient(newPatient);

      return {
        ...newPatient,
        createdAt: newPatient.createdAt.toString(),
        updatedAt: newPatient.updatedAt.toString(),
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Gets all the patient of the given experiment
   * @param experimentId
   * @returns
   */
  public async getAllPatient(experimentId: number): Promise<any> {
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

export default new PatientModel();
