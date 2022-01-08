import { getConnection } from 'typeorm';

import createDBConnection from 'db';
import { Experiments } from 'db/entity/Experiments';
import { Patients } from 'db/entity/Patients';

type ExpData = {
  experiment: any;
  patient: any;
};

/**
 * Experiment settings and logic
 */
export class ExperimentModel {
  currentExperiment: undefined;
  constructor() {
    this.currentExperiment = undefined;
  }

  /**
   * Creates a new experiment with one patient in the database
   */
  async createExperiment(data: ExpData): Promise<any> {
    console.log('New Experiment DB');
    const { experiment, patient } = data;

    try {
      const _newExperiment = new Experiments();
      Object.assign(_newExperiment, experiment);
      const newExperiment = await _newExperiment.save();

      const _newPatient = new Patients();
      Object.assign(_newPatient, patient);
      _newPatient.experiment = newExperiment;
      const newPatient = await _newPatient.save();

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
  }

  /**
   * Fetches recent experiments from the db based on the `limit`
   * @param limit - Number of recent experiments to get
   */
  getRecentExperiments = async (limit: number): Promise<Object[]> =>
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
  updateExperiment = async (experimentId: number) =>
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
  deleteData = async (
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
    return deleted;
  };
}

export default ExperimentModel;
