/**
 * IPC Main communications index file.
 */

const { ipcMain, BrowserWindow, app } = require('electron');

//Other IPCs
const chartIPC = require('./chartIPC');
const recordIPC = require('./recordIPC');

const ipc = () => {
  const mainWindow = BrowserWindow.getAllWindows()[0];

  //Minimze window on minimize icon click
  ipcMain.on('window:minimize', () => {
    mainWindow.minimize();
  });

  //Close/quit window on minimize icon click
  ipcMain.on('window:close', () => {
    app.quit();
  });

  //Restore window on minimize icon click
  ipcMain.on('window:restore', () => {
    mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
  });

  //Record communications
  recordIPC();

  //Chart communications
  chartIPC();
};

module.exports = ipc;
