import { Experiment, Patient } from 'db/models/index';

/**
 * Inserts the new experiment data with one patient to the database
 * @param expData Data collected from the new experiment form
 * @returns The new experiment and patient data from the database
 */
export const insertExpData = async (expData: any) => {
  const { experiment, patient } = expData;

  try {
    // Create a new experiment record in the database
    const newExperiment = await Experiment.create(experiment);
    patient.experiment_id = newExperiment.experiment_id;

    // Create a new patient in the database
    const newPatient = await Patient.create(patient);

    // Extract only the useful information from the query
    const currentPatient = {
      id: newPatient.dataValues.patient_id,
      name: newPatient.dataValues.name,
      description: newPatient.dataValues.description,
      dob: newPatient.dataValues.dob.toString(),
    };
    const currentExperiment = {
      id: newExperiment.dataValues.experiment_id,
      name: newExperiment.dataValues.name,
      description: newExperiment.dataValues.description,
      date: newExperiment.dataValues.date.toString(),
    };

    return { currentExperiment, currentPatient };
  } catch (error) {
    console.log(error);
    return;
  }
};

/**
 * Creates a new patient record in the database
 * @param patientData Data collected from the new patient form
 * @returns The new patient data from the database
 */
export const insertPatientData = async (patientData: Object) => {
  try {
    // Create a new patient in the database
    const newPatient = await Patient.create(patientData);

    // Extract only the useful information from the query
    const currentPatient = {
      id: newPatient.dataValues.patient_id,
      name: newPatient.dataValues.name,
      description: newPatient.dataValues.description,
      dob: newPatient.dataValues.dob.toString(),
    };

    return { currentPatient };
  } catch (error) {
    console.log(error);
    return;
  }
};

// Prepare the object for export
const dbExperimentController = {
  insertExpData,
  insertPatientData,
};

export default dbExperimentController;
