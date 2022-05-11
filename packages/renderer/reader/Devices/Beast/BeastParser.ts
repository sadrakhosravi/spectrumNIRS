import { IDeviceParser } from '../../api/device-api';

// Type
import type { DeviceADCDataType } from 'reader/types/DeviceDataType';
import EventEmitter from 'events';

export type UnpackedDataType = {
  [key: string]: number[];
};

type ChannelsLsbMsbType = {
  [key: string]: {
    msb: Int32Array;
    lsb: Int32Array;
  };
};

export class BeastParser implements IDeviceParser {
  // private pd_num: number;
  private bytes_count: number;
  private msb_indices: number[];
  private bufferFactor: number;
  private bufferSize: number;
  private dataBuff: DeviceADCDataType[];
  private channelsLsbMsb: ChannelsLsbMsbType;
  private emitter: EventEmitter;

  // private led_num: number;

  constructor() {
    // this.pd_num = 0; // 0 ~ 7 -- this variable is set by user
    this.bytes_count = 8 * 2; // msb lsb
    this.msb_indices = [13, 11, 9, 7, 5, 3, 1, 15]; // ch1 ch2 ch3 ... led
    this.bufferFactor = 2;
    this.dataBuff = [];
    this.bufferSize = 512 * this.bufferFactor;
    this.emitter = new EventEmitter();

    // Channels MSB LSB
    this.channelsLsbMsb = {
      ch1: {
        lsb: new Int32Array(this.bufferSize),
        msb: new Int32Array(this.bufferSize),
      },
      ch2: {
        lsb: new Int32Array(this.bufferSize),
        msb: new Int32Array(this.bufferSize),
      },
      ch3: {
        lsb: new Int32Array(this.bufferSize),
        msb: new Int32Array(this.bufferSize),
      },
      ch4: {
        lsb: new Int32Array(this.bufferSize),
        msb: new Int32Array(this.bufferSize),
      },
      ch5: {
        lsb: new Int32Array(this.bufferSize),
        msb: new Int32Array(this.bufferSize),
      },
      ch6: {
        lsb: new Int32Array(this.bufferSize),
        msb: new Int32Array(this.bufferSize),
      },
      ch7: {
        lsb: new Int32Array(this.bufferSize),
        msb: new Int32Array(this.bufferSize),
      },
      ch8: {
        lsb: new Int32Array(this.bufferSize),
        msb: new Int32Array(this.bufferSize),
      },
    };
  }

  /**
   * The parser data emitter, use `data` event to listen for data.
   */
  public get dataEmitter() {
    return this.emitter;
  }

  /**
   * @returns the data buffer and frees the data from the parser memory.
   */
  public getData() {
    return this.dataBuff.splice(0);
  }

  /**
   * Emits the `data` event when data is ready.
   */
  private emitData() {
    this.emitter.emit('data');
  }

  /**
   * Sets the total active PD number.
   */
  public setPDNum = (num: number) => {
    // this.pd_num = num;
    console.log('Parser PD Number updated: ' + num);
  };

  /**
   * Processes the incoming data packet and return an object.
   * @param packet the packet received from the hardware.
   * @returns an object containing the processed data of all the channels of beast hardware.
   */
  public processPacket = (packet: Buffer) => {
    const data = new Uint8Array(packet);
    const dataLength = data.length;
    const msbIndicesLength = this.msb_indices.length;

    let msbArrIndex = new Array(this.msb_indices.length).fill(0);
    let lsbArrIndex = new Array(this.msb_indices.length).fill(0);

    const res: DeviceADCDataType = {
      ch1: {},
      ch2: {},
      ch3: {},
      ch4: {},
      ch5: {},
      ch6: {},
      ch7: {},
      ch8: {},
    };

    // Create each LED for each channel.
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 8; j++) {
        res[`ch${j + 1}`][`led${i}`] = [];
      }
    }

    // Loops over the entire array buffer
    for (let i = 0; i < dataLength; i++) {
      // Find MSBs and LSBs
      for (let j = 0; j < msbIndicesLength; j++) {
        const channelIndex = 'ch' + (j + 1);

        // Find MSBs
        if (i % this.bytes_count === this.msb_indices[j] - 0) {
          this.channelsLsbMsb[channelIndex].msb[msbArrIndex[j]] = data[i];
          msbArrIndex[j]++;
          continue;
        }

        // Find LSBs
        if (i % this.bytes_count === this.msb_indices[j] - 1) {
          this.channelsLsbMsb[channelIndex].lsb[lsbArrIndex[j]] = data[i];
          lsbArrIndex[j]++;
          continue;
        }
      }
    }

    // Bit shifts & data sort
    for (let i = 0; i < 512; i++) {
      for (let j = 0; j < 7; j++) {
        const ledNum = this.channelsLsbMsb['ch8'].lsb[i];

        const channelIndex = 'ch' + (j + 1);

        let d =
          this.channelsLsbMsb[channelIndex].lsb[i] +
          (this.channelsLsbMsb[channelIndex].msb[i] << 8);
        d = (d << 16) >> 16;

        res[channelIndex][`led${ledNum}`].push(d);
      }
    }

    this.dataBuff.push(res);

    // When 2 frames are stored, emit data ready.
    if (this.dataBuff.length === 2) {
      this.emitData();
    }
  };
}
