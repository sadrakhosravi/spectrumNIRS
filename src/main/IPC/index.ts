/**
 * IPC Main communications index file.
 */

import { ipcMain, BrowserWindow, app } from 'electron';

// Other IPCs
import chartIPC from './chartIPC';
import recordIPC from './recordIPC';
import '@IPC/dbIPC';

const ipc = () => {
  // Get the main window open
  const mainWindow = BrowserWindow.getAllWindows()[0];

  // Minimize window on minimize icon click
  ipcMain.on('window:minimize', () => {
    mainWindow.minimize();
  });

  // Close/quit window on minimize icon click
  ipcMain.on('window:close', () => {
    app.quit();
  });

  // Restore window on minimize icon click
  ipcMain.on('window:restore', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    mainWindow.isMaximized() === true
      ? mainWindow.restore()
      : mainWindow.maximize();
  });

  // Record communications
  recordIPC();
  chartIPC();
};

export default ipc;
