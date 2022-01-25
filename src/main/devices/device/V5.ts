import path from 'path';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import {
  IDeviceInput,
  IDeviceStream,
  IGetDevice,
  INIRSDevice,
  DuplexStream,
  Transformer,
  TransformerCallback,
  TransformerOptions,
} from '@lib/Device/device-api';
import { Socket } from 'net';
import readline, { ReadLine } from 'readline';
import toBuffer from 'typedarray-to-buffer';

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

  public startDevice = () => {
    // Kill any prior process before spawning another
    this.spawnedDevices.forEach((device) => device.kill());

    const spawnedDevice = spawn(
      path.join(__dirname, '../../../../resources/drivers/nirs-v5/Test1.exe'),
      ['test', path.join('../../resources/drivers/nirs-v5/Test1.exe')]
    );

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
  streamType: 'stdout';
  sampleBufferSizeInBytes: number;
  deviceStream: ReadLine | null;
  streamReader: null;
  chunks: Float32Array | null;
  count: number;
  arrayPos: number;

  constructor(physicalDevice: INIRSDevice) {
    this.physicalDevice = physicalDevice;
    this.streamType = 'stdout';
    this.sampleBufferSizeInBytes = 147;
    this.deviceStream = null;
    this.streamReader = null;
    this.chunks = null;
    this.count = 0;
    this.arrayPos = 0;
  }

  public getStreamType = () => this.streamType;

  public getSampleBufferSize = () => this.sampleBufferSizeInBytes;

  // Return a stream of individual samples for now
  public getDeviceStream = () => {
    const device = this.physicalDevice.getDevice();

    const duplexStream = new DuplexStream({ highWaterMark: 1024 });

    this.deviceStream = readline
      .createInterface({
        input: device.stdout,
        terminal: false,
      })
      .on('line', (line) => {
        duplexStream._pushWithBackpressure(line);
      });

    return duplexStream;
  };

  stopDeviceStream = () => {
    if (this.deviceStream) {
      this.deviceStream.close();
      this.deviceStream.removeAllListeners('line');
      return true;
    }
    return false;
  };
}

/**
 * Device parser
 */
class V5Parser extends Transformer {
  constructor(options?: TransformerOptions) {
    super(options);
  }

  _transform(
    chunk: Buffer,
    _encoding: BufferEncoding,
    callback: TransformerCallback
  ): void {
    const data = chunk.toString().split(',');
    const DATA_LENGTH = data.length;

    const transformedData = new Float32Array(DATA_LENGTH);

    for (let i = 0; i < DATA_LENGTH; i += 1) {
      transformedData[i] = parseFloat(data[i]);
    }

    this._pushWithBackpressure(toBuffer(transformedData));
    callback();
  }
}

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
