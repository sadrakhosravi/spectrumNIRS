import db from 'db/models/index';

interface IExperiment {}

type ExpData = {
  experiment: any;
  patient: any;
};

/**
 * Experiment settings and logic
 */
export class Experiment implements IExperiment {
  constructor() {}

  /**
   * Creates a new experiment with one patient in the database
   */
  public static async createExperiment(data: ExpData): Promise<any> {
    const { experiment, patient } = data;

    try {
      // Create a new experiment record in the database
      const newExperiment = await db.Experiment.create(experiment);
      patient.experimentId = newExperiment.id;

      // Create a new patient in the database
      const newPatient = await db.Patient.create(patient);

      // Extract only the useful information from the query
      const currentPatient = {
        id: newPatient.dataValues.id,
        name: newPatient.dataValues.name,
        description: newPatient.dataValues.description,
        dob: newPatient.dataValues.dob.toString(),
      };
      const currentExperiment = {
        id: newExperiment.dataValues.id,
        name: newExperiment.dataValues.name,
        description: newExperiment.dataValues.description,
        date: newExperiment.dataValues.date.toString(),
      };

      return { currentExperiment, currentPatient };
    } catch (error) {
      console.log(error);
      return;
    }
  }
}

export default Experiment;
