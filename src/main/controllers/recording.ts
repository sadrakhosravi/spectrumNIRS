import { ipcMain } from 'electron';

// Models
import DataReader from '../models/DataReader';

// Store
let reader: DataReader;

// Select the sensor
ipcMain.on(
  'record:init',
  (
    _event,
    { sensorId, patientId }: { sensorId: number; patientId: number }
  ) => {
    console.log(sensorId, patientId);
    reader = new DataReader(patientId, sensorId);
  }
);

// Start recording
ipcMain.on('record:recording', () => {
  reader.startRecording(); // All necessary functionality of reading NIRS sensor data.
});

// Stop recording
ipcMain.on('record:stop', () => {
  reader.stopRecording();
});

// Pause recording
ipcMain.on('record:pause', () => {
  reader.pauseRecording();
});

// Continue recording
ipcMain.on('record:continue', () => {
  reader.continueRecording();
});
