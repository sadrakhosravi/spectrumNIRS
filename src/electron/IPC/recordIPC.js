/**
 * IPC Communication for record and pause buttons and electron.
 */

const { ipcMain } = require('electron');
const { resolve } = require('path');

const modulePath = resolve('./src/electron/Functions');

//NIRS Data reader module

const recordIPC = () => {
  ipcMain.on('record:recording', () => {
    const nirsReader = require(`${modulePath}/nirsReader`);
    nirsReader(); //All necessary functionality of reading NIRS sensor data.
  });
};

module.exports = recordIPC;
