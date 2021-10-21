/**
 * Opens NIRSReader.exe and reads data from stdout - NIRSReader.exe is referenced by USBData variable
 */

import { BrowserWindow } from 'electron'; // Electron

const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process'); // Spawns a child process (NIRSReader.exe)

// Defining the variables here for memory cleanup later.
let rl: any;
let readUSBData: any;
let lastTimeSequence = 0;
let timeSequence = 0; // timeSequence in centiseconds
let outputArr: Array<any> = []; // Variable before starting to read data

// Spawned processes array to keep track.
const spawnedProcesses: any[] = [];

/**
 * Spawns a child process and runs NIRSReader.exe. Reads each line from NIRSReader.exe stdout.
 * Send the parsed data through IPC.
 * @param prevTime - Last timestamp (used for pause and continue functions only)
 */
const start = (
  prevTime = 0,
  _insertRecordingData: (data: unknown) => Promise<any>
) => {
  const mainWindow = BrowserWindow.getAllWindows()[0];
  const BrowserView = mainWindow.getBrowserView();
  console.log(BrowserView);

  // Spawn NIRSReader.exe
  readUSBData = spawn(
    path.join(__dirname, '../../../resources/drivers/nirs-v5/Test1.exe'),
    ['run', path.join('../../../resources/drivers/nirs-v5/Test1.exe')]
  );
  readUSBData.stderr.on('data', (data: string) => {
    console.error(`Error on loading NIRS Reader: ${data}`);
  });
  readUSBData.on('exit', () => {
    console.log('Process Terminated');
  });

  // Push the spawned process to the spawnedProcesses array to keep track of them.
  spawnedProcesses.push(readUSBData);

  // Count variable to keep track of the readline loop
  let count = 0;

  // Read each line from reader.exe stdout.
  rl = readline
    .createInterface({
      input: readUSBData.stdout,
      terminal: false,
    })
    .on('line', function (line: string) {
      // Split data by , into an array
      const data = line.split(',');
      // const rawValues = [
      //   parseFloat(data[6]), // RI 1
      //   parseFloat(data[7]), // RI 2
      //   parseFloat(data[8]), // RI 3
      //   parseFloat(data[9]), // RI 4
      //   parseFloat(data[10]), // RI 5
      //   parseFloat(data[11]), // Baseline
      // ];

      // Reset the previous time
      if (count === 0) {
        timeSequence += prevTime;
        count = 2;
      }

      // Prepare an array of data
      const _outputArr = [
        timeSequence / 100,
        parseFloat(data[1]),
        parseFloat(data[2]),
        parseFloat(data[3]),
        parseFloat(data[4]),
      ]; // [timeSequence, O2hb, HHb, tHb, TOI]

      outputArr.push(_outputArr);

      if (outputArr.length === 5) {
        // Send the data to be graphed to the renderer
        BrowserView?.webContents.send('data:reader-record', outputArr);
        // mainWindow.webContents.send('data:reader-record', outputArr); // Format = 'TimeSequence,O2Hb,HHb,tHb,TOI'
        outputArr = [];
      }

      //Adjust the data array and swap the timeSequence with the one generated here
      data[0] = (timeSequence / 100).toString();

      // Insert the all data to the database
      // insertRecordingData(data.join(','));

      // Last Step: increment the time sequence +10ms = 1unit (Centiseconds)
      timeSequence += 1;

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
 * @returns `lastTimeSequence` the last time sequence saved
 */
const stop = (): number => {
  // Stop the readline
  rl.close();
  rl.removeAllListeners();

  // Reset the timeSequence
  timeSequence = 0;
  outputArr = [];

  // Kill all spawned processes
  spawnedProcesses.forEach((process) => process.kill());
  readUSBData.kill();
  readUSBData = undefined;
  return lastTimeSequence;
};

// Final object to be exported
const nirsReader = {
  start: start,
  stop: stop,
};

// Export module
export default nirsReader;
export { start, stop };
