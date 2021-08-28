'use-strict';
/**
 * Opens Test1.exe and reads data from stdout - Test1.exe is referenced by USBData variable
 */
const { app, BrowserWindow } = require('electron');

const path = require('path');
const readline = require('readline');

const spawn = require('child_process').spawn;

/**
 *  Opens Test1.exe and reads data from stdout line by line and sends it via main window webcontent.
 * @param {Object} mainWindow - main window object from electron.
 */
const readData = () => {
  console.log(BrowserWindow);
  // const ReadUSBData = spawn(path.join('./src/electron/nirs-reader', 'Test1.exe'), [
  //   'test',
  //   path.join('./src/electron/nirs-reader', 'DataFiles'),
  // ]);
  // ReadUSBData.on('exit', () => {
  //   console.log('Process Terminated');
  // });
  // let count = 0;
  // readline
  //   .createInterface({
  //     input: ReadUSBData.stdout,
  //     terminal: false,
  //   })
  //   .on('line', function (line) {
  //     webContents.send('testdata', JSON.parse(line));
  //     count++;
  //     if (count === 3000) {
  //       console.log('Stopping');
  //       ReadUSBData.kill();
  //     }
  //   });
};

module.exports = readData;
