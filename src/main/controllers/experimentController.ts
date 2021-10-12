import dbExperimentController from '@dbControllers/dbExperimentController';

/**
 * Creates a new experiment
 * @param data Experiment and patient data
 * @returns The created experiment data from the database (currentExperiment, and currentPatient)
 */
export const createNewExperiment = async (data: any) =>
  await dbExperimentController.insertExpData(data);

/**
 * Creates a new patient
 * @param data Patient data
 * @returns The created patient data from the database (currentPatient)
 */
export const createNewPatient = async (patientData: any) => {
  await dbExperimentController.insertPatientData(patientData);
};

// Final object for export
const experimentController = {
  createNewExperiment,
  createNewPatient,
};

export default experimentController;
