/**
 * IPC Communication for record and pause buttons and electron.
 */

const { ipcMain } = require('electron');
const { resolve } = require('path');

const modulePath = resolve('./src/electron/DataReaders');
const nirsReader = require(`${modulePath}/nirsReader`);

let isPaused = false;

//NIRS Data reader module
const recordIPC = () => {
  //Recording state
  ipcMain.on('record:recording', () => {
    nirsReader.start(); //All necessary functionality of reading NIRS sensor data.
  });

  //No recording/idle state
  ipcMain.on('record:stop', () => {
    !isPaused && nirsReader.stop(); //Stop recording
  });

  //Pause recording
  ipcMain.on('record:pause', () => {
    nirsReader.pause();
    isPaused = true;
  });

  //Pause recording
  ipcMain.on('record:continue', () => {
    nirsReader.continueReading();
    isPaused = false;
  });
};

module.exports = recordIPC;
