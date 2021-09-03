/**
 * Opens reader.exe and reads data from stdout - reader.exe is referenced by USBData variable
 */
const path = require('path');
const readline = require('readline');
const spawn = require('child_process').spawn; //Spawns a child process (reader.exe)
const { BrowserWindow, ipcMain } = require('electron'); //Electron

//FIXME: Turn the module into separate functions for calling from recordIPC.

//Find all open windows (mainWindow only)
const mainWindow = await BrowserWindow.getAllWindows()[0];

//Stop and pause boolean.
let stop = false;
let pause = false;
let oldTimeStamp = 0;
let rl;

//Spawned processes array to keep track.
const spawnedProcesses = [];

/**
 * Spawns a child process and runs reader.exe. Reads each line from reader.exe stdout.
 * Send the parsed data through IPC.
 */
const run = async () => {
  let readUSBData;
  /**
   * Spawn reader.exe for NIRS sensor data.
   */
  const spawnReader = () => {
    //Spawn reader.exe
    readUSBData = spawn(path.join('./src/electron/reader', 'reader.exe'), [
      'test',
      path.join('./src/electron/reader', 'DataFiles'),
    ]);
    readUSBData.stderr.on('data', data => {
      console.error(`stderr: ${data}`);
    });
    readUSBData.on('exit', () => {
      console.log('Process Terminated');
    });

    spawnedProcesses.push(readUSBData);
  };

  /**
   * Memory cleanup on stop or pause.
   */
  const cleanup = (all = false) => {
    rl.close();
    rl.removeAllListeners();
    rl = null;

    //If all is true - kill any child processes
    if (all) {
      //Terminate all spawned processes.
      spawnedProcesses.forEach(process => process.kill());
      readUSBData = null;
    }
  };

  //Check recording status.
  ipcMain.on('record:idle', () => {
    stop = true;
    oldTimeStamp = 0;
    process.exit();
  });
  ipcMain.on('record:pause', () => (pause = true));
  ipcMain.on('record:continue', () => {
    pause = false;
    spawnReader();
    readLine();
  });

  //Read each line from reader.exe stdout.

  //Readline STDOUT Template:
  //TimeSequence,O2Hb,Hhb,tHb,TOI,GainVal,RawInt1,RawInt2,RawInt3,RawInt4,RawInt5,Baseline,LEDInt1,LEDInt2,LEDInt3,LEDInt4,LEDInt5,ExtraVal(0)

  const readLine = () => {
    rl = readline
      .createInterface({
        input: readUSBData.stdout,
        terminal: false,
      })
      .on('line', function (line) {
        //Split the values from each line and put it into an array
        const dataArr = line.split(',');

        const timeSequence = dataArr[0] / 1000 + oldTimeStamp;

        const outputArr = [
          timeSequence,
          parseInt(dataArr[1]),
          parseInt(dataArr[2]),
          parseInt(dataArr[3]),
          parseInt(dataArr[4]),
        ]; //[timeSequence, O2hb, HHb, tHb, TOI]

        // Send the data through IPC
        mainWindow.webContents.send('data:nirs-reader', outputArr); //Format = 'TimeSequence,O2Hb,HHb,tHb,TOI'

        //Check if the process has to stop.
        if (stop) {
          console.log('Stopping');
          //Cleanup
          cleanup(true);
        }

        //Check if recording is paused.
        if (pause) {
          oldTimeStamp = timeSequence; //Save the last timestamp
          console.log(oldTimeStamp);
          console.log('Paused Indeed');
          cleanup(true);
        }
      });
  };

  //Spawn reader.exe reader
  spawnReader();
  readLine();
};

module.exports = run;
