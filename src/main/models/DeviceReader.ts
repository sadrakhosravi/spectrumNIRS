// Devices
import V5 from 'devices/V5/V5';
import { BrowserWindow, powerSaveBlocker } from 'electron';
import { Readable } from 'stream';
import WorkerManager from '@electron/models/WorkerManager';
import { databaseRecordingsPath } from '../paths';
import fs from 'fs';

export interface IDeviceInfo {
  samplingRate: number;
  dataByteSize: number;
  batchSize: number;
  numOfElementsPerDataPoint: number;
}

const getNewSqliteDbFileAndPath = () => {
  fs.access(databaseRecordingsPath, (err) => {
    console.log(err);
  });
};

const start = (_port?: MessagePort) => {
  getNewSqliteDbFileAndPath();
  const device = V5;

  // Prevent the application from being suspended.
  // Keeps system active but allows screen to be turned off.
  powerSaveBlocker.start('prevent-app-suspension');

  // Start the device,
  device.Device.startDevice();
  const mainWindow = BrowserWindow.getAllWindows()[0].webContents;

  const worker = WorkerManager.getCalculationWorker();

  let count = 0;
  worker.on('message', (data) => {
    if (count === 1) {
      mainWindow.send('device:test', data);
      count = 0;
    }
    count++;
  });

  const dbWorker = WorkerManager.getDatabaseWorker();

  // Wait for the cold start
  setTimeout(() => {
    const deviceStream = device.Stream.getDeviceStream();
    if (deviceStream instanceof Readable) {
      deviceStream.on('data', (chunk) => {
        const data = device.Parser(chunk);
        dbWorker.postMessage(data);
        worker.postMessage(data, [data.buffer]);
      });
    }
  }, 0);
};

start();
