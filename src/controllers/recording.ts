import { ipcMain } from 'electron';

// Models
import DataReader from '../main/models/DataReader';

// Constants
import { ChartChannels, RecordChannels } from '@utils/channels';

export type CurrentRecording = {
  id: number;
  name: string;
  description: string;
  date: string;
};

type RecordInit = {
  sensorId: number;
  patientId: number;
  currentRecording: CurrentRecording;
  isRawData: boolean;
};

// Store
let reader: DataReader;

// Select the sensor
ipcMain.handle(
  RecordChannels.Init,
  (event, { sensorId, patientId, currentRecording, isRawData }: RecordInit) => {
    console.log(currentRecording);
    reader = new DataReader(
      patientId,
      sensorId,
      currentRecording,
      isRawData,
      event.sender
    );
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
  reader && reader.toggleRawData();
});

// Gain Sync
ipcMain.handle(
  RecordChannels.SyncGain,
  async (_event, data: string[]) =>
    reader && (await reader.syncGainsWithHardware(data))
);

// Hypoxia Event
ipcMain.on(ChartChannels.Event, (_event, data: Object) => {
  reader.toggleEvent(data);
});
