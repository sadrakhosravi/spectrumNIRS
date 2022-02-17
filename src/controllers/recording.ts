import { ipcMain } from 'electron';

// Constants
import { ChartChannels, RecordChannels } from '@utils/channels';

import DeviceReader from '@electron/models/DeviceReader';

export type CurrentRecording = {
  id: number;
  name: string;
  description: string;
  date: string;
};

let deviceReader: DeviceReader | undefined;

// Initialize device reader
ipcMain.handle(RecordChannels.Init, (_event, _args) => {
  if (!deviceReader) {
    deviceReader = new DeviceReader();
    return;
  }

  // If a reader already exists
  deviceReader = undefined;
  setTimeout(() => {
    deviceReader = new DeviceReader();
  });
});

// Start recording
ipcMain.on(RecordChannels.Recording, () => {});

// Start quality monitor
ipcMain.handle(RecordChannels.ProbeCalibration, (_event, isActive) => {
  if (!deviceReader && !isActive) {
    deviceReader = new DeviceReader();
    deviceReader.readDeviceDataOnly();
    console.log('RECREATED');
  }

  if (deviceReader && isActive) {
    deviceReader.stopDevice();
    deviceReader = undefined;
  }
});

// Stop recording
ipcMain.on(RecordChannels.Stop, () => {});

// Pause recording
ipcMain.on(RecordChannels.Pause, () => {});

// Continue recording
ipcMain.on(RecordChannels.Continue, () => {});

// Display Raw Data
ipcMain.on(RecordChannels.RawData, () => {});

// Gain Sync
ipcMain.handle(
  RecordChannels.SyncIntensitiesAndGain,
  async (_event, data: string[]) => {
    console.log('CONTROLLER' + data);
    return deviceReader?.sendCommandToDevice(data.join(','));
  }
);

// Hypoxia Event
ipcMain.on(ChartChannels.Event, (_event, _data: Object) => {});
