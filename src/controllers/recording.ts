import { ipcMain } from 'electron';

// Models
import DataReader from '../main/devices/DeviceReader';

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
export let reader: DataReader | undefined;

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
  reader && reader.startRecording(); // All necessary functionality of reading NIRS sensor data.
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
  reader && reader.continueRecording();
});

// Display Raw Data
ipcMain.on(RecordChannels.RawData, () => {
  reader && reader.toggleRawData();
});

// Gain Sync
ipcMain.handle(RecordChannels.SyncGain, async (_event, data: string[]) => {
  console.log('CONTROLLER' + data);
  console.log(reader);
  await reader?.syncGainsWithHardware(data);
});

// Hypoxia Event
ipcMain.on(ChartChannels.Event, (_event, data: Object) => {
  reader && reader.toggleEvent(data);
});
