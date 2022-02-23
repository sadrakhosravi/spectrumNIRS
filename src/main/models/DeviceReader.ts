// Devices
import V5 from 'devices/V5/V5';
import { BrowserWindow, powerSaveBlocker } from 'electron';
import { Readable } from 'stream';
import WorkerManager from '@electron/models/WorkerManager';
import RecordingModel from '@electron/models/RecordingModel';
import ProbesManager from './ProbesManager';
// import dbParser from '@lib/Stream/DatabaseParser';

import { Worker } from 'worker_threads';
import DownSampler from 'calculations/DownSampler';

import GlobalStore from '@lib/globalStore/GlobalStore';
import { GeneralChannels } from '@utils/channels';
import { DeviceAPI } from '@lib/Device/device-api';
// import dbParser from '@lib/Stream/DatabaseParser';
import { databaseFile } from '@electron/paths';
import dbParser from '@lib/Stream/DatabaseParser';
import TimeStampGenerator from '@lib/Device/TimeStampGenerator';
import V5Calculation from 'calculations/V5/V5Calculation';

export interface IDeviceInfo {
  samplingRate: number;
  dataByteSize: number;
  batchSize: number;
  numOfElementsPerDataPoint: number;
}

export interface RecordState {
  isDeviceStarted: boolean;
  isCalibrating: boolean;
  recordState: 'idle' | 'recording' | 'pause' | 'continue';
}

class DeviceReader {
  recordingSettings: any | undefined;
  deviceSamplingRate: number;
  probeSamplingRate: number;
  downSampleFactor: number;
  device: DeviceAPI;
  mainWindow: Electron.WebContents;
  /**
   * Device data stream pointer
   */
  deviceStream: Readable | null | undefined;
  /**
   * Device data stream pointer
   */
  deviceLogStream: Readable | null | undefined;
  /**
   * Number of samples to average to show for probe calibration chart
   */
  probeCalibrationSamples: number;
  powerSaveBlocker: number;
  timeStamp: TimeStampGenerator;
  calcWorker: Worker | undefined;
  recordingId: number | undefined;

  constructor(lastTimeStamp?: number) {
    this.recordingSettings = RecordingModel.getCurrentRecording()?.settings as
      | JSON
      | undefined;

    // Create the device module instances every time Device Reader
    // is created to conserve memory.
    const Device = new V5.Device();
    const Input = new V5.Input();
    const Stream = new V5.Stream(Device);
    const Parser = V5.Parser;

    this.device = {
      Device,
      Input,
      Stream,
      Parser,
    };
    this.deviceStream = undefined;
    this.deviceLogStream = undefined;

    // Sampling data
    this.deviceSamplingRate =
      this.recordingSettings?.device?.defaultSamplingRate || 100;
    this.probeSamplingRate = this.recordingSettings?.samplingRate || 100;
    this.downSampleFactor = this.deviceSamplingRate / this.probeSamplingRate;

    // Main Window
    this.mainWindow = BrowserWindow.getAllWindows()[0].webContents;
    this.probeCalibrationSamples = 10;
    this.powerSaveBlocker = 0;

    this.timeStamp = new TimeStampGenerator(
      this.device.Stream.getDataBatchSize(),
      lastTimeStamp
    );

    this.calcWorker = undefined;
  }

  /**
   * Starts the device and registers its input commands
   */
  startDevice() {
    // Start the device
    this.device.Device.startDevice();
    // Connect to device input listener
    setTimeout(() => {
      this.device.Input.connect();
      this.syncIntensitiesAndGainWithController();
    }, this.device.Device.getStartupDelay());

    GlobalStore.setRecordState('isDeviceStarted', true);
  }

  /**
   * Stops the physical device and cleans all the listeners
   */
  stopDevice() {
    console.log('DEVICE STOPPED');
    this.terminateDevice();

    powerSaveBlocker.stop(this.powerSaveBlocker);
  }

  terminateDevice() {
    this.deviceStream?.removeAllListeners();
    this.deviceLogStream?.removeAllListeners();
    this.deviceStream = undefined;
    this.deviceLogStream = undefined;

    this.device.Input.closeConnection();
    this.device.Stream.stopDeviceStream();
    this.device.Device.stopDevice();

    this.calcWorker?.removeListener('message', this.listenForCalcWorkerData);
    this.calcWorker = undefined;

    WorkerManager.terminateAllWorkers();
  }

  pauseDevice() {
    this.terminateDevice();
    GlobalStore.setRecordState('recordState', 'pause');
    GlobalStore.setRecordState('isDeviceStarted', false);
    powerSaveBlocker.stop(this.powerSaveBlocker);
  }

  /**
   * Syncs the intensities and gain values of the software with the
   * hardware controller
   */
  syncIntensitiesAndGainWithController() {
    const currentProbe = ProbesManager.getCurrentProbe();

    // Check for no probe
    if (!currentProbe) {
      throw new Error('Could not find any probe in the database');
    }

    const intensities = currentProbe.intensities.join(',');
    const gainValues = currentProbe.preGain + ',' + currentProbe.gain;
    this.sendCommandToDevice(`${intensities},${gainValues}`);
  }

  /**
   * Sends a command/message to the opened device
   * @param message the command to be sent to the device
   */
  sendCommandToDevice(message: string) {
    return this.device.Input.sendToDevice(message);
  }

  /**
   * Checks the given variables and calls the appropriate device reader function
   */
  readDevice() {
    const device = this.device;

    let isDownSampled = false;

    // Check if we should down sample the data
    if (this.downSampleFactor !== 1) {
      // Check for incorrect down sampling factor
      if (this.downSampleFactor % 1 !== 0) {
        throw new Error(
          'Incorrect down sampling factor ' +
            this.downSampleFactor +
            '. Please try again'
        );
      }
      // Data should be down sampled
      isDownSampled = true;
    }

    // Prevent the application from being suspended.
    // Keeps system active but allows screen to be turned off.
    this.powerSaveBlocker = powerSaveBlocker.start('prevent-app-suspension');

    // Start the device,
    device.Device.startDevice();

    this.deviceStream = device.Stream.getDeviceStream() as Readable;

    isDownSampled
      ? this.readDeviceDataWithDownSampling(this.deviceStream as Readable)
      : this.readDeviceData(this.deviceStream as Readable);

    GlobalStore.setRecordState('isDeviceStarted', true);
  }

  /**
   * @returns the database and calculation worker
   */
  startWorkers() {
    const dbProcess = BrowserWindow.getAllWindows()[1];

    // Prepare workers' data
    const workerData = {
      deviceName: this.device.Device.getDeviceName(),
      supportedSamplingRates: this.device.Device.getSupportedSamplingRates(),
      probeSamplingRate: ProbesManager.getCurrentProbe()
        ?.samplingRate as number,
      dataBatchSize: this.device.Stream.getDataBatchSize(),
      numOfElementsPerDataPoint:
        this.device.Stream.getNumOfElementsPerDataPoint(),
      dbFilePath: databaseFile,
    };

    // DB initialization
    dbProcess.webContents.send('db:init', workerData);
    this.calcWorker = WorkerManager.getCalculationWorker(workerData);

    this.calcWorker.on('message', this.listenForCalcWorkerData.bind(this));

    return { calcWorker: this.calcWorker, dbProcess };
  }

  listenForCalcWorkerData(calculatedData: any) {
    this.mainWindow.send('device:data', calculatedData);
  }

  /**
   * Reads and processes the device data at the maximum sampling rate
   * @param deviceStream the stream instance of the device
   */
  readDeviceData(deviceStream: Readable | null | undefined) {
    GlobalStore.setRecordState('recordState', 'recording');
    const device = this.device;

    // Device number of elements and number of data points send to NodeJS
    const NUM_OF_DP = device.Stream.getNumOfElementsPerDataPoint();
    const BATCH_SIZE = device.Stream.getDataBatchSize();

    // The size of the Shared Array buffer used to speed of communication between
    // multiple threads.
    const SAB_SIZE = NUM_OF_DP * BATCH_SIZE;
    const SAB = new SharedArrayBuffer(SAB_SIZE * Int32Array.BYTES_PER_ELEMENT);
    const sharedDataBuffer = new Int32Array(SAB);

    // Start workers
    //@ts-ignore
    const { calcWorker, dbProcess } = this.startWorkers();

    const recordingId = RecordingModel.getCurrentRecording()?.id || 99;

    const V5Calc = new V5Calculation();

    let count = 0;

    if (deviceStream instanceof Readable) {
      deviceStream.on('data', async (chunk: string) => {
        if (count === 100) {
          console.log(process.hrtime.bigint());
          count = 0;
        }
        // Parse the data and store it in the Shared Array
        const data = this.device.Parser(chunk, sharedDataBuffer);
        const parsedData = dbParser(
          data,
          BATCH_SIZE,
          NUM_OF_DP,
          this.timeStamp.addTimeDelta,
          recordingId
        );
        dbProcess.webContents.send('db:data', parsedData);
        // calcWorker.postMessage({
        //   data,
        //   timeStamp: this.timeStamp.getTimeStamp(),
        //   timeDelta: this.timeStamp.getTimeDelta(),
        // });
        const calculatedData = V5Calc.processRawData(data, BATCH_SIZE);
        console.log(calculatedData);
        let delta = this.timeStamp.getTimeDelta();

        calculatedData.forEach((dataPoint) => {
          dataPoint.unshift(this.timeStamp.getTimeStamp() + delta);
          delta += 10;
        });

        this.mainWindow.send('device:data', calculatedData);
        this.timeStamp.generateNextTimeStamp();

        count++;
      });
    }
  }

  /**
   * Reads and processes the device data at the maximum sampling rate but
   * down samples it to the user defined sampling rate
   * @param deviceStream the stream instance of the device
   */
  readDeviceDataWithDownSampling(deviceStream: Readable | null | undefined) {
    const device = this.device;

    // Device number of elements and number of data points send to NodeJS
    const NUM_OF_DP = device.Stream.getNumOfElementsPerDataPoint();
    const BATCH_SIZE = device.Stream.getDataBatchSize();

    // The size of the Shared Array buffer used to speed of communication between
    // multiple threads.
    const SAB_SIZE = NUM_OF_DP * BATCH_SIZE;
    const SAB = new SharedArrayBuffer(SAB_SIZE * Int32Array.BYTES_PER_ELEMENT);
    const sharedDataBuffer = new Int32Array(SAB);

    // const deviceSamplingRate = device.Device.getDefaultSamplingRate();
    // const probeSamplingRate = ProbesManager.currentProbe
    //   ?.samplingRate as number;

    const downSampler = new DownSampler(
      100,
      this.probeCalibrationSamples,
      BATCH_SIZE,
      NUM_OF_DP
    );

    // Start workers
    //@ts-ignore
    const { calcWorker, dbWorker } = this.startWorkers();
    if (deviceStream instanceof Readable) {
      deviceStream.on('data', async (chunk: string) => {
        // Parse the data and store it in the Shared Array
        const data = this.device.Parser(chunk, sharedDataBuffer);
        // const dbData = dbParser(data, BATCH_SIZE, NUM_OF_DP);

        if (downSampler.getIsDataReady()) {
          downSampler.getOutput();
        }

        downSampler.downSampleData(data);
      });
    }
  }

  /**
   * Reads the device data without saving/processing it
   * Used mainly for probe calibration
   */
  readDeviceDataOnly() {
    // Update state
    GlobalStore.setRecordState('isCalibrating', true);

    // Start the device first and register its input
    this.startDevice();

    const deviceName = this.device.Device.getDeviceName();

    this.deviceStream = this.device.Stream.getDeviceStream();
    const deviceParser = this.device.Parser;

    // Device number of elements and number of data points send to NodeJS
    const NUM_OF_DP = this.device.Stream.getNumOfElementsPerDataPoint();
    const BATCH_SIZE = this.device.Stream.getDataBatchSize();

    const SIZE = NUM_OF_DP * BATCH_SIZE;
    const typedArray = new Int32Array(SIZE);

    // Average data to 2Hz
    const downSampler = new DownSampler(
      this.device.Device.getDefaultSamplingRate(),
      this.probeCalibrationSamples,
      BATCH_SIZE,
      NUM_OF_DP
    );

    if (this.deviceStream instanceof Readable) {
      this.deviceStream.on('data', (chunk: string) => {
        if (downSampler.getIsDataReady()) {
          const outputData = downSampler.getOutput();

          if (outputData.length > 1)
            throw Error(
              'Something went wrong. Down sampling engine did not produce the right value'
            );

          this.mainWindow.send('device:calibration', outputData[0].slice(0, 6));
        }

        const data = deviceParser(chunk, typedArray);
        downSampler.downSampleData(data);
      });
    }

    // Send device info to the UI
    if (this.device.Stream.getDeviceLogStream) {
      const deviceLogStream = this.device.Stream.getDeviceLogStream();

      deviceLogStream?.on('data', (chunk: string) => {
        this.mainWindow.send(GeneralChannels.LogMessage, {
          message: `${deviceName}: ${chunk.toString()}`,
          color: '#CCC',
        });
      });
    }
  }
}

export default DeviceReader;
