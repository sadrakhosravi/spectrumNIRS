import { ipcMain } from 'electron';
import { ExperimentChannels } from '@utils/channels';

// Models
import ExperimentModel from '../main/models/ExperimentModel';
import PatientModel from '../main/models/PatientModel';
import RecordingModel from '../main/models/RecordingModel';

// Interfaces
import { INewPatientData } from 'interfaces/interfaces';

//==============================================================================

// Creates a new experiment record with one patient in the database
ipcMain.handle(ExperimentChannels.NewExp, async (_event, data: any) => {
  console.log('New Experiment');
  return await ExperimentModel.createExperiment(data);
});

// Retrieve the numOfRecentExperiment most recent experiments from DB
ipcMain.handle(
  ExperimentChannels.getRecentExperiments,
  async (_event, limit: number) => ExperimentModel.getRecentExperiments(limit)
);

// Selects the current experiment and updates the timestamp
ipcMain.handle(
  ExperimentChannels.GetAndUpdateExp,
  async (_event, experimentId: number) => {
    const experiment = await ExperimentModel.getExperimentData(experimentId);
    ExperimentModel.setCurrentExperiment(experiment || undefined);
    experiment && ExperimentModel.updateExperiment(experiment.id);
  }
);

// Updates experiment last date
ipcMain.handle(
  ExperimentChannels.UpdateExp,
  async (_event, experimentId: number) =>
    await ExperimentModel.updateExperiment(experimentId)
);

// Removes the current experiment and patient from the global state
ipcMain.handle(ExperimentChannels.CloseExperiment, async () => {
  ExperimentModel.setCurrentExperiment(undefined);
  return true;
});

// Delete the selected experiment and all its data
ipcMain.handle(
  ExperimentChannels.deleteExperiment,
  async (_event, experimentId: number) =>
    await ExperimentModel.deleteData(experimentId, 'experiments')
);

//==============================================================================

// Creates a new patient record in the database
ipcMain.handle(
  ExperimentChannels.GetAndUpdatePatient,
  async (_event, patientId: number) => {
    const patient = await PatientModel.getPatientData(patientId);
    PatientModel.setCurrentPatient(patient || undefined);
  }
);

// Creates a new patient record in the database
ipcMain.handle(
  ExperimentChannels.NewPatient,
  async (_event, data: INewPatientData) =>
    await PatientModel.createNewPatient(data)
);

// Gets all patients from the database with the same experimentId (belongs to the same experiment)
ipcMain.handle(
  ExperimentChannels.getAllPatients,
  async (_event, experimentId: number) =>
    await PatientModel.getAllPatient(experimentId)
);
// Gets all patients from the database with the same experimentId (belongs to the same experiment)
ipcMain.handle(ExperimentChannels.RemovePatient, async () =>
  PatientModel.setCurrentPatient(undefined)
);

// Delete the selected patient and all its data
ipcMain.handle(
  ExperimentChannels.deletePatient,
  async (_event, patientId: number) =>
    await ExperimentModel.deleteData(patientId, 'patients')
);

//==============================================================================

// Retrieves all recordings from the database with the same patientId (belongs to the same patient)
ipcMain.handle(
  ExperimentChannels.getAllRecordings,
  async (_event, patientId: number) =>
    await RecordingModel.getAllRecordings(patientId)
);

// Creates a new recording in the database
ipcMain.handle(
  ExperimentChannels.NewRecording,
  async (_event, data: any) => await RecordingModel.createNewRecording(data)
);

// Creates a new recording in the database
ipcMain.handle(
  ExperimentChannels.GetAndUpdateRecording,
  async (_event, recordingId: number) => {
    const recording = await RecordingModel.getRecordingData(recordingId);
    RecordingModel.setCurrentRecording(recording || undefined);
  }
);

// Delete the selected recordings and all its data
ipcMain.handle(
  ExperimentChannels.deleteRecording,
  async (_event, recordingId: number) =>
    await ExperimentModel.deleteData(recordingId, 'recordings')
);

//==============================================================================
