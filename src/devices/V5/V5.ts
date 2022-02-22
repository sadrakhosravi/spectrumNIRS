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
  IPhysicalDevice,
} from '@lib/Device/device-api';

import { Readable } from 'stream';
import { app } from 'electron';
import net from 'node:net';

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
    this.startupDelay = 500;

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

    const spawnedDevice = spawn(readerPath);
    spawnedDevice.stdout.setEncoding('utf-8');

    this.spawnedDevices.push(spawnedDevice);
    return spawnedDevice;
  };

  public stopDevice = () => {
    this.spawnedDevices.forEach((device) => {
      device.removeAllListeners();
    });

    return this.spawnedDevices.map((device) => device.kill());
  };

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
  connection: net.Socket | undefined;

  constructor() {
    this.connection = undefined;
  }

  public createConnectionInterface = () => net.Socket;

  public connect = async () => {};

  public isConnected = () => (this.connection ? true : false);

  public sendToDevice = (message: string) => {
    const DRIVER_SOCKET_IP = '127.0.0.1';
    const DRIVER_SOCKET_PORT = 1337;

    const mySocket = new net.Socket();
    mySocket.connect(DRIVER_SOCKET_PORT, DRIVER_SOCKET_IP, function () {
      console.log('Connection Established');
    });

    let response = mySocket.write(message);

    mySocket.prependOnceListener('error', (data) => {
      if (data) response = false;
      console.log(data);
    });

    mySocket.prependOnceListener('close', () =>
      console.log('Socket Destroyed')
    );
    return response;
  };

  public closeConnection = () => {
    if (this.connection) {
      this.connection.destroy();
      this.connection = undefined;
      return true;
    }

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
  deviceLogStream: Readable | undefined | null;
  chunks: Float32Array | null;
  count: number;
  arrayPos: number;

  constructor(physicalDevice: INIRSDevice | IPhysicalDevice) {
    this.physicalDevice = physicalDevice as INIRSDevice;
    this.streamType = 'stdout';
    this.sampleBufferSizeInBytes = 1350;
    this.outputBufferSizeToUIInBytes = 220;
    this.dataBatchSize = NUM_OF_DATAPOINTS_PER_CHUNK;
    this.numOfElementsPerDataPoint = NUM_OF_ELEMENTS_PER_DATAPOINT;
    this.deviceStream = undefined;
    this.deviceLogStream = undefined;
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

  // Return the stderr as the device logs info to stderr
  public getDeviceLogStream = () => {
    const device = this.physicalDevice.getDevice();
    this.deviceLogStream = device.stderr;
    return this.deviceLogStream;
  };

  stopDeviceStream = () => {
    if (this.deviceStream) {
      this.deviceStream.removeAllListeners();
      this.deviceStream.destroy();
      this.deviceStream = undefined;

      this.deviceLogStream?.removeAllListeners();
      this.deviceLogStream?.destroy();
      this.deviceLogStream = undefined;
      return true;
    }
    return false;
  };
}

/**
 * Device parser
 */
const V5Parser = (
  chunk: String,
  sharedBuffer?: SharedArrayBuffer | Int32Array
): Int32Array => {
  const lines = chunk.split('\r\n');

  const dataArray = new Int32Array(sharedBuffer as SharedArrayBuffer);

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

const Device = V5Device;
const Input = V5Input;
const Parser = V5Parser;
const Stream = V5Stream;

const V5: IGetDevice = {
  Device,
  Input,
  Stream,
  Parser,
};

export default V5;
