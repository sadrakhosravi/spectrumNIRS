import { ipcMain } from 'electron';
import { ExperimentChannels } from '@electron/utils/constants';

// Models
import Patient from '../models/Patient';

// Creates a new patient record in the database
ipcMain.handle(
  ExperimentChannels.NewPatient,
  async (_event, data: Object) => await Patient.createNewPatient(data)
);
