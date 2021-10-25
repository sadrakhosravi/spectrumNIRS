import { ipcMain, IpcMainEvent } from 'electron';

// Models
import DataReader from '../main/models/DataReader';

type RecordInit = {
  sensorId: number;
  patientId: number;
};

// Store
let reader: DataReader;

// Select the sensor
ipcMain.on('record:init', (_, { sensorId, patientId }: RecordInit) => {
  console.log(sensorId, patientId);
  reader = new DataReader(patientId, sensorId);
});

// Start recording
ipcMain.on('record:recording', (event: IpcMainEvent) => {
  reader = new DataReader(1, 0);
  console.log(event.sender);
  // event.sender.send('testing:channel');

  reader.startRecording(event.sender); // All necessary functionality of reading NIRS sensor data.
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
