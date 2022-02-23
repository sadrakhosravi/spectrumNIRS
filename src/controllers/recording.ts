import { BrowserWindow, dialog, ipcMain } from 'electron';

// Constants
import { ChartChannels, RecordChannels } from '@utils/channels';

import DeviceReader from '@electron/models/DeviceReader';
import RecordingModel from '@electron/models/RecordingModel';
import GlobalStore from '@lib/globalStore/GlobalStore';

export type CurrentRecording = {
  id: number;
  name: string;
  description: string;
  date: string;
};

let deviceReader: DeviceReader | undefined;
let lastTimeStamp = 0;

const startDeviceReader = (timeStamp: number = 0) => {
  if (!deviceReader) {
    deviceReader = new DeviceReader(timeStamp);

    return;
  }
  // If a reader already exists
  deviceReader = undefined;
  setImmediate(() => {
    deviceReader = new DeviceReader(timeStamp);
  });
};

// Initialize device reader
ipcMain.handle(RecordChannels.Init, (_event, _args) => {
  const recordingId = RecordingModel.getCurrentRecording()?.id;
  console.log(recordingId);
  if (!recordingId) {
    dialog.showMessageBox(BrowserWindow.getFocusedWindow() as BrowserWindow, {
      title: 'No Recording Found',
      message: 'No Recording Found',
      detail: 'Please create a recording first',
      type: 'error',
    });
    return;
  }

  startDeviceReader(0);
});

// Start recording
ipcMain.handle(RecordChannels.Start, () => {
  console.log('START READER');
  deviceReader?.readDevice();
});

// Stop recording
ipcMain.handle(RecordChannels.Stop, () => {
  GlobalStore.removeRecordState();
  deviceReader?.stopDevice();
  deviceReader = undefined;
  lastTimeStamp = 0;
});

// Pause recording
ipcMain.handle(RecordChannels.Pause, () => {
  lastTimeStamp = deviceReader?.timeStamp.getTheLastTimeStamp() as number;
  deviceReader?.pauseDevice();
  deviceReader = undefined;
});

// Continue recording
ipcMain.handle(RecordChannels.Continue, () => {
  const recordingId = RecordingModel.getCurrentRecording()?.id;

  if (!recordingId) {
    dialog.showMessageBox(BrowserWindow.getFocusedWindow() as BrowserWindow, {
      title: 'No Recording Found',
      message: 'No Recording Found',
      detail: 'Please create a recording first',
      type: 'error',
    });

    deviceReader?.stopDevice();
    deviceReader = undefined;
    GlobalStore.removeRecordState;
    return;
  }

  console.log('CONTINUE COMMAND');
  startDeviceReader(lastTimeStamp);
  deviceReader?.readDevice();
});

// Display Raw Data
ipcMain.handle(RecordChannels.RawData, () => {});

// Gain Sync
ipcMain.handle(
  RecordChannels.SyncIntensitiesAndGain,
  async (_event, data: string[]) => {
    console.log(data.join(','));
    return deviceReader?.sendCommandToDevice(data.join(','));
  }
);

// Start calibration monitor
ipcMain.handle(RecordChannels.ProbeCalibration, (_event, isActive) => {
  if (!deviceReader && !isActive) {
    deviceReader = new DeviceReader();
    deviceReader.readDeviceDataOnly();
    console.log('RECREATED');
  }

  if (deviceReader && isActive) {
    GlobalStore.removeRecordState();

    deviceReader.stopDevice();
    deviceReader = undefined;
  }
});

// Hypoxia Event
ipcMain.on(ChartChannels.Event, (_event, _data: Object) => {});
