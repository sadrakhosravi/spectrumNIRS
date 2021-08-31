/**
 * IPC Main communications index file.
 */

const { ipcMain, BrowserWindow, app } = require('electron');

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
};

module.exports = ipc;
