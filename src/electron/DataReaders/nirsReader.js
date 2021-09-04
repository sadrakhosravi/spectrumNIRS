/**
 * Opens NIRSReader.exe and reads data from stdout - NIRSReader.exe is referenced by USBData variable
 */
const path = require('path');
const readline = require('readline');
const spawn = require('child_process').spawn; //Spawns a child process (NIRSReader.exe)
const { BrowserWindow } = require('electron'); //Electron

//Find all open windows (mainWindow only)
const mainWindow = BrowserWindow.getAllWindows()[0];

//Defining the variables here for memory cleanup later.
let rl;
let readUSBData;
let lastTimeSequence = 0;
let isPaused = false;

//Spawned processes array to keep track.
const spawnedProcesses = [];

/**
 * Spawns a child process and runs NIRSReader.exe. Reads each line from NIRSReader.exe stdout.
 * Send the parsed data through IPC.
 * @param {Number} prevTime - Last timestamp (used for pause and continue functions only)
 */
const start = (prevTime = 0) => {
  //Spawn NIRSReader.exe
  readUSBData = spawn(path.join('./src/electron/NIRSReader-EXE', 'NIRSReader.exe'), [
    'run',
    path.join('./src/electron/NIRSReader-EXE', 'DataFiles'),
  ]);
  readUSBData.stderr.on('data', data => {
    console.error(`Error on loading NIRS Reader: ${data}`);
  });
  readUSBData.on('exit', () => {
    console.log('Process Terminated');
  });

  //Push the spawned process to the spawnedProcesses array to keep track of them.
  spawnedProcesses.push(readUSBData);

  //Read each line from reader.exe stdout.
  rl = readline
    .createInterface({
      input: readUSBData.stdout,
      terminal: false,
    })
    .on('line', function (line) {
      const data = JSON.parse(line);

      //Time Sequence
      const ts = data.TimeStamp;
      const timeSequence = ts + prevTime;

      const outputArr = [timeSequence, data.Probe0.O2Hb, data.Probe0.HHb, data.Probe0.tHb, data.Probe0.TOI]; //[timeSequence, O2hb, HHb, tHb, TOI]

      // Send the data through IPC
      mainWindow.webContents.send('data:nirs-reader', outputArr); //Format = 'TimeSequence,O2Hb,HHb,tHb,TOI'

      //Save the last time sequence
      lastTimeSequence = timeSequence;
    });

  //Log if rl closes
  rl.on('close', () => {
    console.log('Readline closed!');
  });
};

/**
 * Stops the spawned process, closes the readline module, and does some memory cleanup.
 */
const stop = () => {
  //Stop the readline
  rl.close();
  rl.removeAllListeners();
  rl = undefined;

  //Kill all spawned processes
  spawnedProcesses.forEach(process => process.kill());
  readUSBData.kill();
  readUSBData = undefined;

  //Remove Electron event listener
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

module.exports = { start, pause, continueReading, stop };
