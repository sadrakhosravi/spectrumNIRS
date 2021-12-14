import { ipcMain } from 'electron';

// Models
import DataReader from '../main/models/DataReader';
import RecordingsData from '@electron/models/RecordingsData';

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
  lastTimeStamp: number;
};

// Store
let reader: DataReader;

// Select the sensor
ipcMain.handle(
  RecordChannels.Init,
  (
    event,
    {
      sensorId,
      patientId,
      currentRecording,
      isRawData,
      lastTimeStamp,
    }: RecordInit
  ) => {
    console.log('Reader');
    reader = new DataReader(
      patientId,
      sensorId,
      currentRecording,
      isRawData,
      lastTimeStamp,
      event.sender
    );
  }
);

// Start recording
ipcMain.on(RecordChannels.Recording, () => {
  reader.startRecording(); // All necessary functionality of reading NIRS sensor data.
});

// Start quality monitor
ipcMain.on(RecordChannels.QualityMonitor, (_event, active: boolean) => {
  if (!reader) return;
  active && reader.startQualityMonitor();
  !active && reader && reader.stopRecording();
});

// Stop recording
ipcMain.on(RecordChannels.Stop, () => {
  reader && reader.stopRecording();
});

// Pause recording
ipcMain.on(RecordChannels.Pause, () => {
  reader && reader.pauseRecording();
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

// Checks if the current recording has data and sends the data back to the chart.
ipcMain.handle(
  ChartChannels.CheckForData,
  async (_event, recordingId: number) =>
    await RecordingsData.checkForRecordingData(recordingId)
);

// Get RecordingsData based on the given interval
ipcMain.handle(
  ChartChannels.GetDataForInterval,
  async (_event, { recordingId, start, end }) =>
    await RecordingsData.getRecordingDataForInterval(recordingId, start, end)
);

// Get all events
ipcMain.handle(
  ChartChannels.GetAllEvents,
  async (_event, recordingId) => await RecordingsData.getAllEvents(recordingId)
);

// Get RecordingsData based on the given interval
ipcMain.on(
  ChartChannels.StreamData,
  async (event, recordingId) =>
    await RecordingsData.streamRecordingData(recordingId, event.sender)
);

// Hypoxia Event
ipcMain.on(ChartChannels.Event, (_event, data: Object) => {
  reader.toggleEvent(data);
});
