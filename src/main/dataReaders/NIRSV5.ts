/**
 * Opens NIRSReader.exe and reads data from stdout - NIRSReader.exe is referenced by USBData variable
 */
import RecordData from '@electron/models/RecordData';
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process'); // Spawns a child process (NIRSReader.exe)

// Defining the variables here for memory cleanup later.
let rl: any;
let rawData = false;
let outputArr: number[] = [0, 0, 0, 0, 0];
let readUSBData: any;
let lastTimeSequence = 0;
let timeSequence = 0; // timeSequence in centiseconds

// Spawned processes array to keep track.
const spawnedProcesses: any[] = [];

/**
 * Spawns a child process and runs NIRSReader.exe. Reads each line from NIRSReader.exe stdout.
 * Send the parsed data through IPC.
 * @param prevTime - Last timestamp (used for pause and continue functions only)
 */
export const start = (
  prevTime = 0,
  isRawData: boolean,
  sender: any,
  recordingId: number
) => {
  // Check if RawData was requested
  isRawData ? (rawData = true) : (rawData = false);

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
  let dataCount = 0;
  let dataArr: any[] = [];
  let databaseArr: any[] = [];
  let databaseCount = 0;
  const Database = new RecordData(recordingId);

  // Read each line from reader.exe stdout.
  rl = readline
    .createInterface({
      input: readUSBData.stdout,
      terminal: false,
    })
    .on('line', async function (line: string) {
      // Split data by , into an array
      const data = line.split(',');

      // Reset the previous time
      if (count === 0) {
        timeSequence += prevTime;
        count = 2;
      }

      // Raw Data
      const rawDataArr = [
        timeSequence / 100,
        parseFloat(data[1]),
        parseFloat(data[2]),
        parseFloat(data[3]),
        parseFloat(data[4]),
        parseInt(data[5]),
        parseInt(data[6]),
        parseInt(data[7]),
        parseInt(data[8]),
        parseInt(data[9]),
        parseInt(data[10]),
        parseInt(data[11]),
        parseInt(data[12]),
        parseInt(data[13]),
        parseInt(data[14]),
        parseInt(data[15]),
        parseInt(data[16]),
      ];

      // Prepare an array of data
      if (!rawData) {
        outputArr = rawDataArr.slice(0, 5); // [timeSequence, O2hb, HHb, tHb, TOI]
      } else {
        outputArr = [timeSequence / 100, ...rawDataArr.slice(4, 9)]; // [timeSequence, O2hb, HHb, tHb, TOI]
      }

      // Recording.insertRecordingData(line, recordingId);
      databaseArr.push({ values: rawDataArr.join(','), recordingId });

      if (databaseCount === 10) {
        Database.addDataToTransaction(databaseArr);
        databaseArr = [];
        databaseCount = 0;
      }

      dataArr.push(outputArr);

      if (dataCount === 5) {
        sender.send('data:reader-record', dataArr);
        dataArr = [];
        dataCount = 0;
      }

      // Last Step: increment the time sequence +10ms = 1unit (Centiseconds)
      timeSequence += 1;
      dataCount++;
      databaseCount++;

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
export const stop = (): number => {
  // Stop the readline
  rl.close();
  rl.removeAllListeners();

  // Reset the timeSequence
  timeSequence = 0;

  // Kill all spawned processes
  spawnedProcesses.forEach((process) => process.kill());
  readUSBData.kill();
  readUSBData = undefined;
  return lastTimeSequence;
};

/**
 * Toggle the data to be sent to the UI - Calculated Data or Raw Data
 */
export const toggleRawData = () => {
  rawData = !rawData;
};

// Final object to be exported
const nirsReader = {
  start,
  stop,
  toggleRawData,
};

// Export module
export default nirsReader;
