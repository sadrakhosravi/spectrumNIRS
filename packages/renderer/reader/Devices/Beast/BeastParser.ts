import { IDeviceParser } from '../../api/device-api';

export type UnpackedDataType = {
  [key: string]: number[];
};

export type UnpackedDataType2 = {
  [key: string]: {
    [key: string]: number[];
  };
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
  private bufferSize: 512;
  channelsLsbMsb: ChannelsLsbMsbType;

  // private led_num: number;

  constructor() {
    // this.pd_num = 0; // 0 ~ 7 -- this variable is set by user
    this.bytes_count = 8 * 2; // msb lsb
    this.msb_indices = [13, 11, 9, 7, 5, 3, 1, 15]; // ch1 ch2 ch3 ... led
    this.bufferSize = 512;
    // this.led_num = 0; // 0 ~ 15 -- this variable is set by user

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
    // console.time('1');

    const data = new Uint8Array(packet);

    // // // fill channels data
    // let res: UnpackedDataType = {
    //   ch1: [],
    //   ch2: [],
    //   ch3: [],
    //   ch4: [],
    //   ch5: [],
    //   ch6: [],
    //   ch7: [],
    //   led_nums: [],
    // };

    let example: UnpackedDataType2 = {
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
        example[`ch${j + 1}`][`led${i}`] = [];
      }
    }

    const dataLength = data.length;
    const msbIndicesLength = this.msb_indices.length;

    let msbArrIndex = new Array(this.msb_indices.length).fill(0);
    let lsbArrIndex = new Array(this.msb_indices.length).fill(0);

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

        example[channelIndex][`led${ledNum}`].push(d);
      }
    }

    // console.timeEnd('1');

    // // console.log('New Method');
    // // console.log(example);

    // // console.time('2');
    // for (let index = 0; index < this.msb_indices.length; index++) {
    //   // if (index >= this.pd_num && index !== 7) continue;

    //   const lsbArr = Int32Array.from(
    //     data.filter((_, i) => i % this.bytes_count === this.msb_indices[index] - 1),
    //   );
    //   const msbArr = Int32Array.from(
    //     data.filter((_, i) => i % this.bytes_count === this.msb_indices[index] - 0),
    //   );

    //   // else // channels
    //   //@ts-ignore
    //   res[Object.keys(res)[index as number] as any] = lsbArr.map((lsb, i) => {
    //     let d = lsb + (msbArr[i] << 8);
    //     d = (d << 16) >> 16;
    //     return d;
    //   });
    // }
    // console.timeEnd('2');

    // console.log('Old Method');
    // console.log(res);

    // // find indices of arrays with led_num
    // let indexArray: number[] = [];
    // indexArray = res.led_nums.reduce((b, _e, i) => {
    //   //@ts-ignore
    //   b.push(i);
    //   return b;
    // }, []);

    // res.ch1 = indexArray.map((i) => res.ch1[i]);
    // res.ch2 = indexArray.map((i) => res.ch2[i]);
    // res.ch3 = indexArray.map((i) => res.ch3[i]);
    // res.ch4 = indexArray.map((i) => res.ch4[i]);
    // res.ch5 = indexArray.map((i) => res.ch5[i]);
    // res.ch6 = indexArray.map((i) => res.ch6[i]);
    // res.ch7 = indexArray.map((i) => res.ch7[i]);
    // res.led_nums = indexArray.map((i) => res.led_nums[i]);
    // // console.timeEnd('1');
    // console.log('New Method');
    // console.log(example);
    // console.log('Old Method');
    // console.log(res);
    return example;
  };
}
