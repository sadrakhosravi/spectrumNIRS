import { ipcMain } from 'electron';
import { ExperimentChannels } from 'utils/channels';

// Models
import Patient from '../main/models/Patient';

// Creates a new patient record in the database
ipcMain.handle(
  ExperimentChannels.NewPatient,
  async (_event, data: Object) => await Patient.createNewPatient(data)
);
