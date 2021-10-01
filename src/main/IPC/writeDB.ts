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
    // Create the experiment first
    const newExperiment = await Experiment.create(experiment);

    // If the experiment was created successfully, get its id for db relations
    patient.experiment_id = newExperiment.experiment_id;

    // Create the patient next
    await Patient.create(patient);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
});
