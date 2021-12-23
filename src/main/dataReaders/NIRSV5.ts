/**
 * Opens NIRSReader.exe and reads data from stdout - NIRSReader.exe is referenced by USBData variable
 */
import RecordingsData from '@electron/models/RecordingsData';
import net from 'net';

const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process'); // Spawns a child process (NIRSReader.exe)

// Socket for connecting to the driver
const DRIVER_SOCKET_IP = '127.0.0.1';
const DRIVER_SOCKET_PORT = 1337;

// Defining the variables here for memory cleanup later.
let rl: any;
let rawData = false;
let outputArr: number[] = [0, 0, 0, 0, 0];
let readUSBData: any;
let lastTimeSequence = 0;
let timeSequence = 0; // timeSequence in milliseconds
const databaseArr: any[] = [];
let databaseCount = 0;
let Database: RecordingsData | undefined;

let events = {
  hypoxia: false,
  event2: false,
};

const gainValues = {
  hardware: ['HIGH', 100],
  software: 1,
};

/**
 * Sends the gains given from the UI to the driver
 */
export const syncGains = async (data: string[]) => {
  const mySocket = new net.Socket();
  mySocket.connect(DRIVER_SOCKET_PORT, DRIVER_SOCKET_IP, function () {
    console.log('Connection Established');
  });

  let response = mySocket.write(data.join(','));

  mySocket.on('error', (data) => {
    if (data) response = false;
    console.log(data);
  });

  mySocket.on('close', () => console.log('Socket Destroyed'));

  return response;
};

/**
 * Spawns an instance of the NIRSV5 reader
 */
const spawnNIRSV5 = () => {
  spawnedProcesses.forEach((process) => process.kill());
  // Check if there is already a spawned process before spawning another.
  // Spawn NIRSReader.exe
  readUSBData = spawn(
    path.join(__dirname, '../../../resources/drivers/nirs-v5/Test1.exe'),
    ['test', path.join('../../../resources/drivers/nirs-v5/Test1.exe')]
  );

  readUSBData.stderr.on('data', (data: string) => {
    console.error(`Log from NIRS Reader: ${data}`);
  });
  readUSBData.on('exit', () => {
    console.log('Process Terminated');
  });

  // Push the spawned process to the spawnedProcesses array to keep track of them.
  spawnedProcesses.push(readUSBData);
};

// Spawned processes array to keep track.
const spawnedProcesses: any[] = [];

/**
 * Spawns a child process and runs NIRSReader.exe. Reads each line from NIRSReader.exe stdout.
 * Send the parsed data through IPC.
 * @param prevTime - Last timestamp (used for pause and continue functions only)
 */
export const start = async (
  prevTime = 0,
  isRawData: boolean,
  sender: any,
  recordingId: number
) => {
  // Check if RawData was requested
  isRawData ? (rawData = true) : (rawData = false);
  console.log('RecordingId:' + recordingId);
  lastTimeSequence = 0;

  // Count variable to keep track of the readline loop
  let count = 0;
  let sendCount = 0;
  let sendArr: any[] = [];

  Database = new RecordingsData(recordingId);
  spawnNIRSV5();

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
      // Used direct array element access instead of a loop for the fastest possible calculation
      const rawDataArr = [
        timeSequence,
        (parseFloat(data[1]) / 1000) * -1,
        (parseFloat(data[2]) / 100) * -1,
        (parseFloat(data[3]) / 1000) * -1,
        parseFloat(data[4]) - 60,
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
      databaseArr.push({
        timeStamp: rawDataArr[0],
        O2Hb: rawDataArr[1],
        HHb: rawDataArr[2],
        THb: rawDataArr[3],
        TOI: rawDataArr[4],
        PDRawData: rawDataArr.slice(6, 12).join(','),
        LEDIntensities: rawDataArr.slice(12, 17).join(','),
        gainValues: JSON.stringify(gainValues),
        event: Object.values(events).some((event) => event === true) ? 1 : null,
        events: JSON.stringify(events),
        recording: recordingId,
      });

      if (databaseCount === 200) {
        Database?.addDataToTransaction(databaseArr);
        databaseArr.length = 0;
        databaseCount = 0;
      }

      if (sendCount === 3) {
        sender.send('data:reader-record', sendArr);
        sendArr.length = 0;
        sendCount = 0;
      }

      sendArr.push(outputArr);

      // Last Step: increment the time sequence +10ms = 1unit (milliseconds)
      timeSequence += 10; // Increase time by 10 milliseconds
      databaseCount++;
      sendCount++;

      // Save the last time sequence
      lastTimeSequence = timeSequence;
    });

  // Log if readline closes
  rl.on('close', () => {
    console.log('Readline closed!');
  });
};

/**
 * Starts the V5 sensor for quality check, no data will be saved
 */

export const startQualityMonitor = async (sender: any) => {
  spawnNIRSV5();
  let count = 0;
  let LEDPDs = [0, 0, 0, 0, 0, 0];

  rl = readline
    .createInterface({
      input: readUSBData.stdout,
      terminal: false,
    })
    .on('line', async function (line: string) {
      const data = line.split(',');
      const outputArr = [
        parseInt(data[6]),
        parseInt(data[7]),
        parseInt(data[8]),
        parseInt(data[9]),
        parseInt(data[10]),
        parseInt(data[11]),
      ];

      outputArr.forEach((data, i) => (LEDPDs[i] += data));

      // Take the average of each

      if (count === 50) {
        LEDPDs.forEach((_, i) => (LEDPDs[i] = LEDPDs[i] / 50));
        sender.send('signal-quality-monitor-data', LEDPDs);
        console.log(LEDPDs);
        LEDPDs.forEach((_, i) => (LEDPDs[i] = 0));

        count = 0;
      }
      count++;
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

  // Write the remaining data to the database
  databaseArr.length > 0 && Database?.addDataToTransaction(databaseArr);
  databaseArr.length = 0;
  databaseCount = 0;
  Database = undefined;

  // Reset the timeSequence
  timeSequence = 0;

  // Kill all spawned processes
  spawnedProcesses.forEach((process) => process.kill());
  readUSBData = undefined;
  return lastTimeSequence;
};

/**
 * Toggle the data to be sent to the UI - Calculated Data or Raw Data
 */
export const toggleRawData = () => {
  rawData = !rawData;
};

/**
 * Toggles the event that was passed in
 */
export const toggleEvent = (event: object | any) => {
  const eventName = Object.keys(event)[0] as keyof typeof events;
  const eventState = event[eventName] as boolean;
  events[eventName] = eventState;
};

// Final object to be exported
const nirsReader = {
  start,
  startQualityMonitor,
  stop,
  toggleRawData,
  toggleEvent,
  syncGains,
};

// Export module
export default nirsReader;
