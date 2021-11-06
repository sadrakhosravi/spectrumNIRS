import { ipcMain } from 'electron';

// Models
import DataReader from '../main/models/DataReader';

// Constants
import { RecordChannels } from '@utils/channels';

type RecordInit = {
  sensorId: number;
  patientId: number;
};

// Store
let reader: DataReader;

// Select the sensor
ipcMain.handle(
  RecordChannels.Init,
  (event, { sensorId, patientId }: RecordInit) => {
    console.log(sensorId, patientId);
    reader = new DataReader(patientId, sensorId, event.sender);
  }
);

// Start recording
ipcMain.on(RecordChannels.Recording, () => {
  reader.startRecording(); // All necessary functionality of reading NIRS sensor data.
});

// Stop recording
ipcMain.on(RecordChannels.Stop, () => {
  reader.stopRecording();
});

// Pause recording
ipcMain.on(RecordChannels.Pause, () => {
  reader.pauseRecording();
});

// Continue recording
ipcMain.on(RecordChannels.Continue, () => {
  console.log('Continue');
  reader.continueRecording();
});

// Display Raw Data
ipcMain.on(RecordChannels.RawData, () => {
  reader.toggleRawData();
});
