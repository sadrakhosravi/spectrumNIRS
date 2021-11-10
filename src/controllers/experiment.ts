import { ipcMain } from 'electron';
import { ExperimentChannels } from 'utils/channels';

// Models
import Experiment from '@electron/models/Experiment';
import Patient from '../main/models/Patient';
import Recording from '../main/models/Recording';

// Interfaces
import { INewPatientData } from 'interfaces/interfaces';

// Creates a new experiment record with one patient in the database
ipcMain.handle(
  ExperimentChannels.NewExp,
  async (_event, data: any) => await Experiment.createExperiment(data)
);

// Retrieve the numOfRecentExperiment most recent experiments from DB
ipcMain.handle(
  ExperimentChannels.getRecentExperiments,
  async (_event, limit: number) => Experiment.getRecentExperiments(limit)
);

// Creates a new patient record in the database
ipcMain.handle(
  ExperimentChannels.NewPatient,
  async (_event, data: INewPatientData) => await Patient.createNewPatient(data)
);

// Creates a new recording in the database
ipcMain.handle(
  ExperimentChannels.NewRecording,
  async (_event, data: any) => await Recording.createNewRecording(data)
);
