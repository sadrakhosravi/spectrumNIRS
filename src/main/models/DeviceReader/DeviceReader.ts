// Devices
import V5 from 'devices/V5/V5';
import { BrowserWindow, ipcMain, powerSaveBlocker } from 'electron';
import { Readable } from 'stream';
import RecordingModel, {
  IRecordingData,
} from '@electron/models/RecordingModel';
import ProbesManager from '../ProbesManager';
import WorkerManager from '@electron/models/WorkerManager';

import { Worker } from 'worker_threads';
import DownSampler from 'calculations/DownSampler';

import GlobalStore from '@lib/globalStore/GlobalStore';
import { GeneralChannels } from '@utils/channels';
import { DeviceAPI } from '@lib/Device/device-api';
import { databaseFile } from '@electron/paths';
import TimeStampGenerator from '@lib/Device/TimeStampGenerator';
import V5Calculation from 'calculations/V5/V5Calculation';

import { DBDataModel } from '@lib/dataTypes/BinaryData';
import LiveFilter from 'filters/LiveFilter';
import { defaultLPCoef } from 'filters/filterConstants';

// Deep copies an object in a performant way
import { exportServer } from 'controllers/exportServer';
import copyDeviceDataObject from '@electron/helpers/copyDeviceDataObj';

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
  timeStamp!: TimeStampGenerator;
  calcWorker: Worker | undefined;
  recordingId: number | undefined;
  currentRecording: IRecordingData | undefined;
  events: { hypoxia: boolean; event2: boolean };
  deviceData: any[];

  constructor(_lastTimeStamp?: number) {
    this.currentRecording = RecordingModel.getCurrentRecording();
    this.recordingSettings = this.currentRecording?.settings as
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

    this.deviceData = [];

    // Sampling data
    this.deviceSamplingRate =
      this.recordingSettings?.device?.defaultSamplingRate || 100;
    this.probeSamplingRate = this.recordingSettings?.samplingRate || 100;
    this.downSampleFactor = this.deviceSamplingRate / this.probeSamplingRate;

    // Main Window
    this.mainWindow = BrowserWindow.getAllWindows()[0].webContents;
    this.probeCalibrationSamples = 10;
    this.powerSaveBlocker = 0;

    this.calcWorker = undefined;
    this.events = {
      hypoxia: false,
      event2: false,
    };

    console.log('DEVICE READER CREATED');
  }

  /**
   * Starts the device and registers its input commands
   */
  startDevice = async () => {
    // Start the device
    this.device.Device.startDevice();
    // Connect to device input listener
    setTimeout(() => {
      this.device.Input.connect();
      this.syncIntensitiesAndGainWithController();
    }, this.device.Device.getStartupDelay());

    GlobalStore.setRecordState('isDeviceStarted', true);
  };

  /**
   * Stops the physical device and cleans all the listeners
   */
  stopDevice() {
    exportServer?.getIsStreaming() && exportServer?.stopStream();

    console.log('DEVICE STOPPED');
    this.terminateDevice();

    powerSaveBlocker.stop(this.powerSaveBlocker);
  }

  /**
   * Terminates the active device reader and sets the states accordingly
   */
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

    const dbProcess = BrowserWindow.getAllWindows()[1];

    this.deviceData.length !== 0 && this.sendDbData(dbProcess);
    dbProcess.webContents.send('db:close');

    ipcMain.removeAllListeners('calc:live-filter-lowpass');
    ipcMain.removeAllListeners('calc:live-filter-highpass');
    WorkerManager.terminateAllWorkers();
  }

  pauseDevice() {
    exportServer?.pauseStream();

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
  readDevice = async () => {
    let isDownSampled = false;

    const lastTimeStamp =
      await RecordingModel.getCurrentRecordingLastTimeStamp();
    this.timeStamp = new TimeStampGenerator(
      this.device.Stream.getDataBatchSize(),
      lastTimeStamp || 0
    );

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
    await this.startDevice();

    this.deviceStream = this.device.Stream.getDeviceStream() as Readable;

    if (exportServer && exportServer.getDoesHaveActiveListeners()) {
      exportServer.startStream();
    }

    isDownSampled
      ? this.readDeviceDataWithDownSampling(this.deviceStream as Readable)
      : this.readDeviceData(this.deviceStream as Readable);

    // TODO: Add signal generator option instead of commenting/uncommenting
    // this.generateDummySignal();

    GlobalStore.setRecordState('isDeviceStarted', true);
  };

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
      recordingId: RecordingModel.getCurrentRecording()?.id,
    };

    // DB initialization
    dbProcess.webContents.send('db:init', workerData);
    // this.calcWorker = WorkerManager.getCalculationWorker(workerData);

    // this.calcWorker.on('message', this.listenForCalcWorkerData.bind(this));
    this.calcWorker = undefined;
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
    const BATCH_SIZE = device.Stream.getDataBatchSize();
    const SAMPLING_RATE = this.recordingSettings?.samplingRate || 100;
    const DB_SAVE_INTERVAL = SAMPLING_RATE * 5; // Saves every 5 seconds of data as one packet;
    const TIME_DELTA = this.timeStamp.getTimeDelta();

    // TOI Value
    const TOIAverageFactor =
      (ProbesManager.getCurrentProbe()?.samplingRate || 100) / 5;
    let TOI = 0; // TOI initializer used to average
    let TOICount = 0;

    // The size of the Shared Array buffer used to speed of communication between
    // multiple threads.

    // Start workers
    //@ts-ignore
    const { dbProcess } = this.startWorkers();

    const recordingId = RecordingModel.getCurrentRecording()?.id;
    if (!recordingId) return;

    const LEDIntensities = ProbesManager.getCurrentProbe()
      ?.intensities as number[];

    // Calculations
    const V5Calc = new V5Calculation(LEDIntensities);
    const filters = new LiveFilter(5);
    filters.createLowpassFilters(
      SAMPLING_RATE,
      defaultLPCoef.Fc,
      defaultLPCoef.order
    );

    ipcMain.on('calc:live-filter-lowpass', (_event, data) => {
      filters.createLowpassFilters(SAMPLING_RATE, data.Fc, data.order);
    });
    ipcMain.on('calc:live-filter-highpass', (_event, data) => {
      filters.createHighpassFilters(SAMPLING_RATE, data.Fc, data.order);
      console.log('HIGHPASS TRIGGERED');
    });

    let dataPointCount = 0;

    if (deviceStream instanceof Readable) {
      deviceStream.on('data', async (chunk: string) => {
        // Send data to the database writer every 5 second
        if (dataPointCount === DB_SAVE_INTERVAL) {
          this.sendDbData(dbProcess);
          dataPointCount = 0;
        }

        // Parse the data and store it in the Shared Array
        const data = this.device.Parser(chunk);
        this.deviceData.push(...data);

        //@ts-ignore
        const data_copy = copyDeviceDataObject(data, BATCH_SIZE);

        // Filter then calc data
        const filteredData = filters.filterData(data_copy);
        const calculatedData = V5Calc.processRawData(filteredData, BATCH_SIZE);

        // Add timeStamp to the data that is going to be graphed
        let tDelta = 0;
        calculatedData.forEach((dataPoint) => {
          dataPoint[0] = this.timeStamp.getTimeStamp() + tDelta;
          tDelta += TIME_DELTA;
          TOI += dataPoint[dataPoint.length - 1];
          TOICount++;
        });

        this.mainWindow.send('device:data', calculatedData);

        if (exportServer) {
          const calcData = V5Calc.processRawData(
            data,
            BATCH_SIZE,
            this.timeStamp.getTimeStamp(),
            TIME_DELTA
          );
          exportServer?.send(calcData, calcData.length);
        }

        // Send average TOI
        if (TOICount === TOIAverageFactor) {
          this.mainWindow.send('device:TOI', TOI / TOIAverageFactor);
          TOI = 0;
          TOICount = 0;
        }

        // Add counters
        this.timeStamp.generateNextTimeStamp();
        dataPointCount += BATCH_SIZE;
      });
    }
  }

  /**
   * Send the device data buffer to the db process
   * @param dbProcess - The db renderer process to send data to
   */
  sendDbData(dbProcess: Electron.BrowserWindow) {
    console.time('startCompress');

    const dbDataBuffer = DBDataModel.toBuffer(this.deviceData);
    // const dbBuffer = Buffer.from(buffer);

    const timeSequence =
      this.timeStamp.getTimeStamp() -
      this.deviceData.length * this.timeStamp.getTimeDelta();

    dbProcess.webContents.send('db:data', {
      data: dbDataBuffer,
      timeSequence: timeSequence,
      timeStamp: Date.now(),
    });

    this.deviceData.length = 0;
    console.timeEnd('startCompress');
  }

  /**
   * Reads and processes the device data at the maximum sampling rate but
   * down samples it to the user defined sampling rate
   * @param deviceStream the stream instance of the device
   */
  readDeviceDataWithDownSampling(deviceStream: Readable | null | undefined) {
    const device = this.device;

    // Device number of elements and number of data points send to NodeJS
    const BATCH_SIZE = device.Stream.getDataBatchSize();
    const ADC_CHANNELS = this.device.Device.getADCNumOfChannels();
    const NUM_OF_PDs = this.device.Device.getNumOfPDs();

    // The size of the Shared Array buffer used to speed of communication between
    // multiple threads.

    // const deviceSamplingRate = device.Device.getDefaultSamplingRate();
    // const probeSamplingRate = ProbesManager.currentProbe
    //   ?.samplingRate as number;

    const downSampler = new DownSampler(
      100,
      this.probeCalibrationSamples,
      BATCH_SIZE,
      ADC_CHANNELS,
      NUM_OF_PDs
    );

    // Start workers
    //@ts-ignore
    const { calcWorker, dbWorker } = this.startWorkers();
    if (deviceStream instanceof Readable) {
      deviceStream.on('data', async (chunk: string) => {
        // Parse the data and store it in the Shared Array
        const data = this.device.Parser(chunk);
        // const dbData = prepareDbData(data, BATCH_SIZE, NUM_OF_DP);

        downSampler.downSampleData(data);
      });
    }
  }

  /**
   * Toggles the specified event to be saved
   * @param event - The event object
   */
  toggleEvent(event: object | any) {
    const eventName = Object.keys(event)[0] as keyof typeof this.events;
    const eventState = event[eventName] as boolean;
    this.events[eventName] = eventState;
  }

  /**
   * Reads the device data without saving/processing it
   * Used mainly for probe calibration
   */
  readDeviceDataOnly = async () => {
    // Update state
    GlobalStore.setRecordState('isCalibrating', true);

    // Start the device first and register its input
    await this.startDevice();

    const deviceName = this.device.Device.getDeviceName();

    this.deviceStream = this.device.Stream.getDeviceStream();
    const Parser = this.device.Parser;

    // Get device stream info
    const BATCH_SIZE = this.device.Stream.getDataBatchSize();
    const ADC_CHANNELS = this.device.Device.getADCNumOfChannels();
    const NUM_OF_PDs = this.device.Device.getNumOfPDs();

    // Average data to 2Hz
    const downSampler = new DownSampler(
      this.device.Device.getDefaultSamplingRate(),
      this.probeCalibrationSamples,
      BATCH_SIZE,
      ADC_CHANNELS,
      NUM_OF_PDs
    );

    const downSamplerData = downSampler.getDataEmitter();

    // Listen for when the downsampled data is ready
    downSamplerData.on('data', (data) =>
      this.mainWindow.send('device:calibration', data)
    );

    // If device reader stream is readable, read data
    if (this.deviceStream instanceof Readable) {
      this.deviceStream.on('data', (chunk: string) => {
        console.time('downsample');
        const data = Parser(chunk);
        downSampler.downSampleData(data);
        console.timeEnd('downsample');
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
  };
}

export default DeviceReader;
