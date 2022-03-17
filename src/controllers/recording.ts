import { BrowserWindow, dialog, ipcMain } from 'electron';

// Constants
import { ChartChannels, RecordChannels } from '@utils/channels';

import DeviceReader from '@electron/models/DeviceReader/DeviceReader';
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

export const initDeviceReader = (timeStamp: number = 0) => {
  if (!deviceReader) {
    deviceReader = new DeviceReader(timeStamp);
    return;
  }
};

export const startDeviceReader = () => {
  console.log('START READER');
  deviceReader?.readDevice();
};

export const pauseDeviceReader = () => {
  lastTimeStamp = deviceReader?.timeStamp.getTheLastTimeStamp() as number;
  deviceReader?.pauseDevice();
  deviceReader = undefined;
};

export const continueDeviceReader = () => {
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
  initDeviceReader(lastTimeStamp);
  deviceReader?.readDevice();
};

export const stopDeviceReader = () => {
  GlobalStore.removeRecordState();
  deviceReader?.stopDevice();
  deviceReader = undefined;
  lastTimeStamp = 0;
};

// Initialize device reader
ipcMain.handle(RecordChannels.Init, (_event, _args) => {
  const recordingId = RecordingModel.getCurrentRecording()?.id;
  if (!recordingId) {
    dialog.showMessageBox(BrowserWindow.getFocusedWindow() as BrowserWindow, {
      title: 'No Recording Found',
      message: 'No Recording Found',
      detail: 'Please create a recording first',
      type: 'error',
    });
    return;
  }

  initDeviceReader();
});

// Start recording
ipcMain.handle(RecordChannels.Start, () => startDeviceReader());

// Stop recording
ipcMain.handle(RecordChannels.Stop, () => stopDeviceReader());

// Pause recording
ipcMain.handle(RecordChannels.Pause, () => pauseDeviceReader());

// Continue recording
ipcMain.handle(RecordChannels.Continue, () => continueDeviceReader());

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

ipcMain.handle(ChartChannels.Event, (_event, _data) => {
  console.log(_data);
  deviceReader?.addEvents(_data);
});

const RecordingFunctions = {
  initDeviceReader,
  startDeviceReader,
  pauseDeviceReader,
  continueDeviceReader,
  stopDeviceReader,
};

export default RecordingFunctions;
