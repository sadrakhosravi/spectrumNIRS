/**
 * Opens NIRSReader.exe and reads data from stdout - NIRSReader.exe is referenced by USBData variable
 */

//@ts-nocheck
import { BrowserWindow } from 'electron'; // Electron

const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process'); // Spawns a child process (NIRSReader.exe)

const { Recording } = require('../Database/models/index');

// Defining the variables here for memory cleanup later.
let rl: any;
let readUSBData: any;
let lastTimeSequence = 0;

// Spawned processes array to keep track.
const spawnedProcesses: any[] = [];

/**
 * Spawns a child process and runs NIRSReader.exe. Reads each line from NIRSReader.exe stdout.
 * Send the parsed data through IPC.
 * @param {Number} prevTime - Last timestamp (used for pause and continue functions only)
 */
const start = (prevTime = 0) => {
  const mainWindow = BrowserWindow.getAllWindows()[0];

  console.log(path.resolve(__dirname, '../Readers'));
  // Spawn NIRSReader.exe
  readUSBData = spawn(path.join(__dirname, '../Readers/Test1.exe'), [
    'run',
    path.join('./DataFiles'),
  ]);
  readUSBData.stderr.on('data', (data: string) => {
    console.error(`Error on loading NIRS Reader: ${data}`);
  });
  readUSBData.on('exit', () => {
    console.log('Process Terminated');
  });

  // Push the spawned process to the spawnedProcesses array to keep track of them.
  spawnedProcesses.push(readUSBData);
  let DataArr = [];

  const sendDataToDB = async (data) => {
    await Recording.bulkCreate(DataArr, { returning: true });
  };

  let count = 0;

  // Read each line from reader.exe stdout.
  rl = readline
    .createInterface({
      input: readUSBData.stdout,
      terminal: false,
    })
    .on('line', function (line: string) {
      const data = line.split(',');

      // Time Sequence
      const ts = parseFloat(data[0]);

      const timeSequence = ts + prevTime;

      const outputArr = [
        timeSequence / 1000,
        parseFloat(data[1]),
        parseFloat(data[2]),
        parseFloat(data[3]),
        parseFloat(data[4]),
      ]; // [timeSequence, O2hb, HHb, tHb, TOI]

      const test = { value: outputArr.join(',') };

      DataArr.push(test);

      if (count === 500) {
        sendDataToDB(DataArr);
        DataArr = [];
        count = 0;
      }
      count++;

      // Send the data through IPC
      mainWindow.webContents.send('data:nirs-reader', outputArr); // Format = 'TimeSequence,O2Hb,HHb,tHb,TOI'

      // Save the last time sequence
      lastTimeSequence = timeSequence;
    });

  // Log if rl closes
  rl.on('close', () => {
    console.log('Readline closed!');
  });
};

/**
 * Stops the spawned process, closes the readline module, and does some memory cleanup.
 */
const stop = () => {
  const mainWindow = BrowserWindow.getAllWindows()[0];

  // Stop the readline
  rl.close();
  rl.removeAllListeners();
  rl = undefined;

  // Kill all spawned processes
  spawnedProcesses.forEach((process) => process.kill());
  readUSBData.kill();
  readUSBData = undefined;

  // Remove Electron event listener
  mainWindow.webContents.removeListener('data:nirs-reader', () => {});
};

/**
 * Pauses the recording by closing the readline, killing the child process, saving the last timestamp.
 */
const pause = () => {
  stop();
};

const continueReading = () => {
  console.log(lastTimeSequence);
  start(lastTimeSequence);
};

export default '';
export { start, pause, continueReading, stop };
