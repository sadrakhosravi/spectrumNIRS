/**
 * IPC Communication for chart controls and electron.
 */

const { ipcMain } = require('electron');

const chartIPC = () => {
  //Minimize window on minimize icon click
  ipcMain.on('chart:record', () => {
    //Do something
  });

  ipcMain.on('chart:pause', () => {
    //Do something
  });
};

module.exports = chartIPC;
