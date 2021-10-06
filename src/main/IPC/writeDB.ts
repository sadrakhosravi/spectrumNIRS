/**
 * IPC Communication for chart controls and electron.
 */

import { ipcMain } from 'electron';
import { Experiment, Patient } from '@electron/db/models/index';

/**
 * All DB write related IPCs
 */

// Creates a new experiment record in the database
ipcMain.handle('db:new-experiment', async (_event, data) => {
  // Default experiment settings JSON object
  const experimentSettings = {
    SamplingRate: '100',
    NumOfChannels: '4',
  };

  console.log(experimentSettings);

  const { experiment, patient } = data;

  console.log(data);

  try {
    const newExperiment = await Experiment.create(experiment);

    // If the experiment was created successfully, get its id for db relations
    patient.experiment_id = newExperiment.experiment_id;

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
  } catch (err) {
    console.log(err);
  }
});
