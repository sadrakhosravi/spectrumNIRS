import path from 'path';
import {
  ChildProcessWithoutNullStreams,
  spawn,
  SpawnOptionsWithoutStdio,
} from 'child_process';
// import readline from 'readline';
import {
  IDeviceInput,
  IDeviceStream,
  IGetDevice,
  INIRSDevice,
} from '@lib/Device/device-api';
import { Socket } from 'net';
import { Readable } from 'stream';
import { app, BrowserWindow, dialog } from 'electron';

// Constants
const NUM_OF_DATAPOINTS_PER_CHUNK = 10;
const NUM_OF_ELEMENTS_PER_DATAPOINT = 12;
/**
 * V5 NIRS Device class
 */
class V5Device implements INIRSDevice {
  name: string;
  serialNumber: string;
  version: string;
  samplingRates: number[];
  defaultSamplingRate: number;
  PDs: { name: string; location: string }[];
  LEDs: number[];
  startupDelay: number;
  spawnedDevices: ChildProcessWithoutNullStreams[];

  constructor() {
    this.name = 'NIRS V4/V5';
    this.serialNumber = 'nirs-v4-v5-1.0';
    this.version = '1.0.0';
    this.samplingRates = [1.0, 5.0, 25.0, 50.0, 100.0];
    this.defaultSamplingRate = 100;
    this.PDs = [{ name: 'main', location: 'main' }];
    this.LEDs = [680, 740, 810, 840, 950];
    this.startupDelay = 1000;

    this.spawnedDevices = [];
  }

  public startDevice = (_options?: SpawnOptionsWithoutStdio) => {
    // Kill any prior process before spawning another
    this.spawnedDevices.forEach((device) => device.kill());

    const readerPath = app.isPackaged
      ? path.join(
          process.resourcesPath,
          'resources',
          'drivers',
          'nirs-v5',
          'Test1.exe'
        )
      : path.join(__dirname, '../../../resources/drivers/nirs-v5/Test1.exe');

    dialog.showMessageBox(BrowserWindow.getAllWindows()[0], {
      title: 'Test',
      message: readerPath,
    });

    const spawnedDevice = spawn(readerPath, [], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    spawnedDevice.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    spawnedDevice.channel?.close();

    spawnedDevice.stdin;

    spawnedDevice.stdout.setEncoding('binary');

    this.spawnedDevices.push(spawnedDevice);
    return spawnedDevice;
  };

  public stopDevice = () => this.spawnedDevices.map((device) => device.kill());

  public getDeviceName = () => this.name;

  public getDeviceSerialNumber = () => this.serialNumber;

  public getNumberOfLEDs = () => this.LEDs.length;

  public getPDs = () => this.PDs;

  public getNumberOfPD = () => this.PDs.length;

  public getSupportedSamplingRates = () => this.samplingRates;

  public getDefaultSamplingRate = () => this.defaultSamplingRate;

  public getVersion = () => this.version;

  public getStartupDelay = () => this.startupDelay;

  public getDevice = () => this.spawnedDevices[0];
}

/**
 * Device input communication
 */
class V5Input implements IDeviceInput {
  connection: Socket | null;

  constructor() {
    this.connection = null;
  }

  public createConnectionInterface = () => new Socket();

  public connect = () => {
    const IP = '127.0.0.1';
    const PORT = 1337;

    const connectionInterface = this.createConnectionInterface();
    const connection = connectionInterface.connect(PORT, IP);

    // Set the connection if successfully connected
    const onConnectionSuccess = () => {
      this.connection = connected;
    };

    const onConnectionError = () => {
      throw Error('Failed to connect to the hardware');
    };

    const connected = connection.on('ready', onConnectionSuccess);
    connection.on('error', onConnectionError);
  };

  public isConnected = () => (this.connection ? true : false);

  public sendToDevice = (message: string) => {
    if (!this.connection) return false;

    const isSuccessful = this.connection.write(message);
    if (isSuccessful) return true;

    return false;
  };
}

/**
 * Device stream class
 */
class V5Stream implements IDeviceStream {
  physicalDevice: INIRSDevice;
  NIRSV5Reader: Readable | undefined | null;
  streamType: 'stdout';
  sampleBufferSizeInBytes: number;
  outputBufferSizeToUIInBytes: number;
  dataBatchSize: number;
  numOfElementsPerDataPoint: number;
  deviceStream: Readable | undefined | null;
  chunks: Float32Array | null;
  count: number;
  arrayPos: number;

  constructor(physicalDevice: INIRSDevice) {
    this.physicalDevice = physicalDevice;
    this.NIRSV5Reader = undefined;
    this.streamType = 'stdout';
    this.sampleBufferSizeInBytes = 1350;
    this.outputBufferSizeToUIInBytes = 220;
    this.dataBatchSize = NUM_OF_DATAPOINTS_PER_CHUNK;
    this.numOfElementsPerDataPoint = NUM_OF_ELEMENTS_PER_DATAPOINT;
    this.deviceStream = undefined;
    this.chunks = null;
    this.count = 0;
    this.arrayPos = 0;
  }

  public getStreamType = () => this.streamType;

  public getSampleBufferSize = () => this.sampleBufferSizeInBytes;

  public getOutputBufferSizeToUIInBytes = () =>
    this.outputBufferSizeToUIInBytes;

  public getDataBatchSize = () => this.dataBatchSize;

  public getNumOfElementsPerDataPoint = () => this.numOfElementsPerDataPoint;

  // Return a stream of individual samples for now
  public getDeviceStream = () => {
    const device = this.physicalDevice.getDevice();

    this.deviceStream = device.stdout;

    return this.deviceStream;
  };

  stopDeviceStream = () => {
    if (this.deviceStream) {
      this.NIRSV5Reader = undefined;
      this.deviceStream = undefined;
      return true;
    }
    return false;
  };
}

/**
 * Device parser
 */
const V5Parser = (chunk: Buffer): Uint16Array => {
  const lines = chunk.toString().split(/\r?\n/);

  const dataArray = new Uint16Array(
    NUM_OF_DATAPOINTS_PER_CHUNK * NUM_OF_ELEMENTS_PER_DATAPOINT
  ).fill(0);

  let arrayIndex = 0;
  // Use a for loop for the best performance
  for (let i = 0; i < NUM_OF_DATAPOINTS_PER_CHUNK; i += 1) {
    const data = lines[i].split(',');

    for (let j = 0; j < NUM_OF_ELEMENTS_PER_DATAPOINT; j += 1) {
      // Parse numbers
      dataArray[arrayIndex] = ~~data[j];
      arrayIndex += 1;
    }
  }

  return dataArray;
};

const Device = new V5Device();
const Input = new V5Input();
const Parser = V5Parser;
const Stream = new V5Stream(Device);

const V5: IGetDevice = {
  Device,
  Input,
  Stream,
  Parser,
};

export default V5;
