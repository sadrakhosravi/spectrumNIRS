import { ipcMain } from 'electron';
import { ExperimentChannels } from '@utils/constants';

// Models
import Experiment from '@electron/models/Experiment';

// Creates a new experiment record with one patient in the database
ipcMain.handle(
  ExperimentChannels.NewExp,
  async (_event, data: any) => await Experiment.createExperiment(data)
);

// // Prepare a new recording and selects the sensor to be used
// ipcMain.handle(
//   ExperimentChannels.NewRecording,
//   async (_event, data: Object) =>
//     await experimentController.createNewPatient(data)
// );
