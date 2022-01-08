import { ipcMain } from 'electron';
import { ExperimentChannels } from '@utils/channels';

// Models
import ExperimentModel from '../main/models/Experiment';
import Patient from '../main/models/Patient';
import Recording from '../main/models/Recording';

// Interfaces
import { INewPatientData } from 'interfaces/interfaces';

const Experiment = new ExperimentModel();

// Creates a new experiment record with one patient in the database
ipcMain.handle(ExperimentChannels.NewExp, async (_event, data: any) => {
  console.log('New Experiment');
  return await Experiment.createExperiment(data);
});

// Retrieve the numOfRecentExperiment most recent experiments from DB
ipcMain.handle(
  ExperimentChannels.getRecentExperiments,
  async (_event, limit: number) => Experiment.getRecentExperiments(limit)
);

ipcMain.handle(
  ExperimentChannels.UpdateExp,
  async (_event, experimentId: number) =>
    await Experiment.updateExperiment(experimentId)
);

// Creates a new patient record in the database
ipcMain.handle(
  ExperimentChannels.NewPatient,
  async (_event, data: INewPatientData) => await Patient.createNewPatient(data)
);

// Retrieves all patients from the database with the same experimentId (belongs to the same experiment)
ipcMain.handle(
  ExperimentChannels.getAllPatients,
  async (_event, experimentId: number) =>
    await Patient.getAllPatient(experimentId)
);

// Creates a new recording in the database
ipcMain.handle(
  ExperimentChannels.NewRecording,
  async (_event, data: any) => await Recording.createNewRecording(data)
);

// Retrieves all recordings from the database with the same patientId (belongs to the same patient)
ipcMain.handle(
  ExperimentChannels.getAllRecordings,
  async (_event, patientId: number) =>
    await Recording.getAllRecordings(patientId)
);

// Delete the selected experiment and all its data
ipcMain.handle(
  ExperimentChannels.deleteExperiment,
  async (_event, experimentId: number) =>
    await Experiment.deleteData(experimentId, 'experiments')
);

// Delete the selected patient and all its data
ipcMain.handle(
  ExperimentChannels.deletePatient,
  async (_event, patientId: number) =>
    await Experiment.deleteData(patientId, 'patients')
);

// Delete the selected recordings and all its data
ipcMain.handle(
  ExperimentChannels.deleteRecording,
  async (_event, recordingId: number) =>
    await Experiment.deleteData(recordingId, 'recordings')
);
