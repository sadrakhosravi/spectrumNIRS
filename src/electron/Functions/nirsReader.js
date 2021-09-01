/**
 * Opens Test1.exe and reads data from stdout - Test1.exe is referenced by USBData variable
 */
const path = require('path');
const readline = require('readline');
const spawn = require('child_process').spawn;

const { BrowserWindow, ipcMain } = require('electron');

const nirsReader = () => {
  const mainWindow = BrowserWindow.getAllWindows()[0];

  let stop = false;

  const readUSBData = spawn(path.join('./src/electron/nirs-reader', 'Test1.exe'), [
    'test',
    path.join('./src/electron/nirs-reader', 'DataFiles'),
  ]);
  readUSBData.on('exit', () => {
    console.log('Process Terminated');
  });

  ipcMain.on('record:idle', () => (stop = true));

  let count = 0;

  readline
    .createInterface({
      input: readUSBData.stdout,
      terminal: false,
    })
    .on('line', function (line) {
      mainWindow.webContents.send('testdata', JSON.parse(line));
      count++;
      if (count === 3000 || stop) {
        console.log('Stopping');
        readUSBData.kill();
      }
    });
};

module.exports = nirsReader;
