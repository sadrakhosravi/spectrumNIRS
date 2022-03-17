import { getConnection } from 'typeorm';
import createDBConnection from 'db';

import { Experiments } from 'db/entity/Experiments';
import { Patients } from 'db/entity/Patients';

import PatientModel from './PatientModel';

import GlobalStore from '@lib/globalStore/GlobalStore';

export interface IExperimentData {
  id: number;
  name: string;
  date: string | Date;
  description: string;
  lastUpdate: string;
  updatedAt: string;
}

type ExpData = {
  experiment: any;
  patient: any;
};

/**
 * Experiment settings and logic
 */
export class ExperimentModel {
  currentExperiment: undefined | Experiments;
  constructor() {
    this.currentExperiment = undefined;
  }

  /**
   * @returns the current experiment
   */
  public getCurrentExperiment = () => this.currentExperiment;

  /**
   * Sets the current experiment data
   * @param experiment - the experiment to be set as the current experiment
   */
  public setCurrentExperiment = (experiment: Experiments | undefined) => {
    GlobalStore.removeExperiment();
    GlobalStore.removePatient();
    GlobalStore.removeRecording();

    this.currentExperiment = experiment;

    if (!this.currentExperiment) {
      GlobalStore.removeExperiment();
      GlobalStore.removePatient();
      GlobalStore.removeRecording();
      return;
    }

    // update the global store
    GlobalStore.setExperiment('currentExp', this.currentExperiment);
  };

  /**
   * @param experimentId the id of the experiment to get the data
   * @returns the stored data of the experiment
   */
  public getExperimentData = async (
    experimentId: number
  ): Promise<Experiments | undefined> => {
    return await getConnection()
      .createQueryBuilder()
      .select()
      .from(Experiments, '')
      .where(`id = ${experimentId}`)
      .getRawOne();
  };

  /**
   * Creates a new experiment with one patient in the database
   */
  public createExperiment = async (data: ExpData): Promise<any> => {
    console.log('New Experiment DB');
    const { experiment, patient } = data;

    try {
      const _newExperiment = new Experiments();
      Object.assign(_newExperiment, experiment);
      const newExperiment = await _newExperiment.save();

      // Set the current experiment after successful creation
      this.setCurrentExperiment(newExperiment);

      const _newPatient = new Patients();
      Object.assign(_newPatient, patient);
      _newPatient.experiment = newExperiment;
      const newPatient = await _newPatient.save();

      // Set the current patient after successful creation
      PatientModel.setCurrentPatient(newPatient);

      return {
        currentExperiment: {
          id: newExperiment.id,
          name: newExperiment.name,
          description: newExperiment.description,
        },
        currentPatient: {
          id: newPatient.id,
          name: newPatient.name,
          description: newPatient.description,
        },
      };
    } catch (error: any) {
      console.log(error);
      return;
    }
  };

  /**
   * Fetches recent experiments from the db based on the `limit`
   * @param limit - Number of recent experiments to get
   */
  public getRecentExperiments = async (limit: number): Promise<Object[]> =>
    await getConnection()
      .createQueryBuilder()
      .select()
      .from(Experiments, '')
      .limit(limit)
      .orderBy({
        updatedAt: 'DESC',
      })
      .getRawMany();

  /**
   * Updates the given experiment
   * @param experimentId - The id of the experiment to update
   */
  public updateExperiment = async (experimentId: number) =>
    await getConnection()
      .createQueryBuilder()
      .update(Experiments)
      .set({
        updatedAt: new Date(),
        lastUpdate: new Date().toLocaleString('en-US', {
          hour12: false,
        }),
      })
      .where('id = :id', { id: experimentId })
      .execute();

  /**
   * Deletes the data of the given table based on the given id
   * @param id - Id of the record to be deleted
   * @param table - name of the table
   */
  public deleteData = async (
    id: number,
    table: 'experiments' | 'patients' | 'recordings'
  ) => {
    const deleted = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(table)
      .where('id = :id', { id })
      .execute();

    await getConnection().query('VACUUM');
    await getConnection().close();
    await createDBConnection();

    // Remove the current experiment if it was deleted
    if (id === this.currentExperiment?.id) {
      this.setCurrentExperiment(undefined);
    }

    return deleted;
  };
}

export default new ExperimentModel();
