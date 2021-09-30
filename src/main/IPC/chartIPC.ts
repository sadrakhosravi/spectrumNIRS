/**
 * IPC Communication for chart controls and electron.
 */

import { ipcMain } from 'electron';

// Minimize window on minimize icon click
ipcMain.on('chart:record', () => {
  // Do something
});

ipcMain.on('chart:pause', () => {
  // Do something
});
