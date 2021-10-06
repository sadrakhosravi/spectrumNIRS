/**
 * IPC Communication for record and pause buttons and electron.
 */

import { ipcMain } from 'electron';

import {
  start,
  stop,
  continueReading,
  pause,
} from '@readerFunctions/nirsReader';

let isPaused = false;

// Recording state
ipcMain.on('record:recording', (_event, patientId: number) => {
  start(0, patientId); // All necessary functionality of reading NIRS sensor data.
});

// No recording/idle state
ipcMain.on('record:stop', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  !isPaused === true && stop(); // Stop recording
});

// Pause recording
ipcMain.on('record:pause', () => {
  pause();
  isPaused = true;
});

// Pause recording
ipcMain.on('record:continue', () => {
  continueReading();
  isPaused = false;
});
