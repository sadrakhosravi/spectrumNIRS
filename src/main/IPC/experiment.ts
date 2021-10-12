/**
 * IPC Communication for chart controls and electron.
 */

import { ipcMain } from 'electron';
import experimentController from '@controllers/experimentController';
import { ExperimentChannels } from '@utils/constants';

// Creates a new experiment record with one patient in the database
ipcMain.handle(
  ExperimentChannels.NewExp,
  async (_event, data: Object) =>
    await experimentController.createNewExperiment(data)
);

// Creates a new experiment record in the database
ipcMain.handle(
  ExperimentChannels.NewPatient,
  async (_event, data: Object) =>
    await experimentController.createNewPatient(data)
);
