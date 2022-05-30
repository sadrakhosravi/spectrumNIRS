import { IDeviceParser } from '../../api/device-api';

// Type
import type { DeviceADCDataType, DeviceDataTypeWithMetaData } from '../../api/Types';

export type UnpackedDataType = {
  [key: string]: number[];
};

export type BeastParserDataType = {
  ADC1: {
    ch0: Int32Array;
    ch1: Int32Array;
    ch2: Int32Array;
    ch3: Int32Array;
    ch4: Int32Array;
    ch5: Int32Array;
    ch6: Int32Array;
    ch7: Int32Array;
    ch8: Int32Array;
    ch9: Int32Array;
    ch10: Int32Array;
    ch11: Int32Array;
    ch12: Int32Array;
    ch13: Int32Array;
    ch14: Int32Array;
    ch15: Int32Array;
  };
  ADC2: {
    ch0: Int32Array;
    ch1: Int32Array;
    ch2: Int32Array;
    ch3: Int32Array;
    ch4: Int32Array;
    ch5: Int32Array;
    ch6: Int32Array;
    ch7: Int32Array;
    ch8: Int32Array;
    ch9: Int32Array;
    ch10: Int32Array;
    ch11: Int32Array;
    ch12: Int32Array;
    ch13: Int32Array;
    ch14: Int32Array;
    ch15: Int32Array;
  };
  ADC3: {
    ch0: Int32Array;
    ch1: Int32Array;
    ch2: Int32Array;
    ch3: Int32Array;
    ch4: Int32Array;
    ch5: Int32Array;
    ch6: Int32Array;
    ch7: Int32Array;
    ch8: Int32Array;
    ch9: Int32Array;
    ch10: Int32Array;
    ch11: Int32Array;
    ch12: Int32Array;
    ch13: Int32Array;
    ch14: Int32Array;
    ch15: Int32Array;
  };
  ADC4: {
    ch0: Int32Array;
    ch1: Int32Array;
    ch2: Int32Array;
    ch3: Int32Array;
    ch4: Int32Array;
    ch5: Int32Array;
    ch6: Int32Array;
    ch7: Int32Array;
    ch8: Int32Array;
    ch9: Int32Array;
    ch10: Int32Array;
    ch11: Int32Array;
    ch12: Int32Array;
    ch13: Int32Array;
    ch14: Int32Array;
    ch15: Int32Array;
  };
  ADC5: {
    ch0: Int32Array;
    ch1: Int32Array;
    ch2: Int32Array;
    ch3: Int32Array;
    ch4: Int32Array;
    ch5: Int32Array;
    ch6: Int32Array;
    ch7: Int32Array;
    ch8: Int32Array;
    ch9: Int32Array;
    ch10: Int32Array;
    ch11: Int32Array;
    ch12: Int32Array;
    ch13: Int32Array;
    ch14: Int32Array;
    ch15: Int32Array;
  };
  ADC6: {
    ch0: Int32Array;
    ch1: Int32Array;
    ch2: Int32Array;
    ch3: Int32Array;
    ch4: Int32Array;
    ch5: Int32Array;
    ch6: Int32Array;
    ch7: Int32Array;
    ch8: Int32Array;
    ch9: Int32Array;
    ch10: Int32Array;
    ch11: Int32Array;
    ch12: Int32Array;
    ch13: Int32Array;
    ch14: Int32Array;
    ch15: Int32Array;
  };
  ADC7: {
    ch0: Int32Array;
    ch1: Int32Array;
    ch2: Int32Array;
    ch3: Int32Array;
    ch4: Int32Array;
    ch5: Int32Array;
    ch6: Int32Array;
    ch7: Int32Array;
    ch8: Int32Array;
    ch9: Int32Array;
    ch10: Int32Array;
    ch11: Int32Array;
    ch12: Int32Array;
    ch13: Int32Array;
    ch14: Int32Array;
    ch15: Int32Array;
  };
  ADC8: {
    ch0: Int32Array;
    ch1: Int32Array;
    ch2: Int32Array;
    ch3: Int32Array;
    ch4: Int32Array;
    ch5: Int32Array;
    ch6: Int32Array;
    ch7: Int32Array;
    ch8: Int32Array;
    ch9: Int32Array;
    ch10: Int32Array;
    ch11: Int32Array;
    ch12: Int32Array;
    ch13: Int32Array;
    ch14: Int32Array;
    ch15: Int32Array;
  };
};

type ChannelsLsbMsbType = {
  [key in keyof BeastParserDataType]: {
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
  private channelsLsbMsb: ChannelsLsbMsbType;

  /**
   * The parsed result object of Spectrum
   */
  private res: BeastParserDataType & DeviceADCDataType;

  // private led_num: number;

  constructor() {
    // this.pd_num = 0; // 0 ~ 7 -- this variable is set by user
    this.bytes_count = 8 * 2; // msb lsb
    this.msb_indices = [13, 11, 9, 7, 5, 3, 1, 15]; // ch1 ch2 ch3 ... led
    this.bufferFactor = 1;
    this.bufferSize = 512 * this.bufferFactor;

    // Channels MSB LSB
    this.channelsLsbMsb = {
      ADC1: {
        lsb: new Int32Array(this.bufferSize),
        msb: new Int32Array(this.bufferSize),
      },
      ADC2: {
        lsb: new Int32Array(this.bufferSize),
        msb: new Int32Array(this.bufferSize),
      },
      ADC3: {
        lsb: new Int32Array(this.bufferSize),
        msb: new Int32Array(this.bufferSize),
      },
      ADC4: {
        lsb: new Int32Array(this.bufferSize),
        msb: new Int32Array(this.bufferSize),
      },
      ADC5: {
        lsb: new Int32Array(this.bufferSize),
        msb: new Int32Array(this.bufferSize),
      },
      ADC6: {
        lsb: new Int32Array(this.bufferSize),
        msb: new Int32Array(this.bufferSize),
      },
      ADC7: {
        lsb: new Int32Array(this.bufferSize),
        msb: new Int32Array(this.bufferSize),
      },
      ADC8: {
        lsb: new Int32Array(this.bufferSize),
        msb: new Int32Array(this.bufferSize),
      },
    };

    // Parsed result obj
    this.res = {
      ADC1: {
        ch0: new Int32Array(this.bufferSize),
        ch1: new Int32Array(this.bufferSize),
        ch2: new Int32Array(this.bufferSize),
        ch3: new Int32Array(this.bufferSize),
        ch4: new Int32Array(this.bufferSize),
        ch5: new Int32Array(this.bufferSize),
        ch6: new Int32Array(this.bufferSize),
        ch7: new Int32Array(this.bufferSize),
        ch8: new Int32Array(this.bufferSize),
        ch9: new Int32Array(this.bufferSize),
        ch10: new Int32Array(this.bufferSize),
        ch11: new Int32Array(this.bufferSize),
        ch12: new Int32Array(this.bufferSize),
        ch13: new Int32Array(this.bufferSize),
        ch14: new Int32Array(this.bufferSize),
        ch15: new Int32Array(this.bufferSize),
      },
      ADC2: {
        ch0: new Int32Array(this.bufferSize),
        ch1: new Int32Array(this.bufferSize),
        ch2: new Int32Array(this.bufferSize),
        ch3: new Int32Array(this.bufferSize),
        ch4: new Int32Array(this.bufferSize),
        ch5: new Int32Array(this.bufferSize),
        ch6: new Int32Array(this.bufferSize),
        ch7: new Int32Array(this.bufferSize),
        ch8: new Int32Array(this.bufferSize),
        ch9: new Int32Array(this.bufferSize),
        ch10: new Int32Array(this.bufferSize),
        ch11: new Int32Array(this.bufferSize),
        ch12: new Int32Array(this.bufferSize),
        ch13: new Int32Array(this.bufferSize),
        ch14: new Int32Array(this.bufferSize),
        ch15: new Int32Array(this.bufferSize),
      },
      ADC3: {
        ch0: new Int32Array(this.bufferSize),
        ch1: new Int32Array(this.bufferSize),
        ch2: new Int32Array(this.bufferSize),
        ch3: new Int32Array(this.bufferSize),
        ch4: new Int32Array(this.bufferSize),
        ch5: new Int32Array(this.bufferSize),
        ch6: new Int32Array(this.bufferSize),
        ch7: new Int32Array(this.bufferSize),
        ch8: new Int32Array(this.bufferSize),
        ch9: new Int32Array(this.bufferSize),
        ch10: new Int32Array(this.bufferSize),
        ch11: new Int32Array(this.bufferSize),
        ch12: new Int32Array(this.bufferSize),
        ch13: new Int32Array(this.bufferSize),
        ch14: new Int32Array(this.bufferSize),
        ch15: new Int32Array(this.bufferSize),
      },
      ADC4: {
        ch0: new Int32Array(this.bufferSize),
        ch1: new Int32Array(this.bufferSize),
        ch2: new Int32Array(this.bufferSize),
        ch3: new Int32Array(this.bufferSize),
        ch4: new Int32Array(this.bufferSize),
        ch5: new Int32Array(this.bufferSize),
        ch6: new Int32Array(this.bufferSize),
        ch7: new Int32Array(this.bufferSize),
        ch8: new Int32Array(this.bufferSize),
        ch9: new Int32Array(this.bufferSize),
        ch10: new Int32Array(this.bufferSize),
        ch11: new Int32Array(this.bufferSize),
        ch12: new Int32Array(this.bufferSize),
        ch13: new Int32Array(this.bufferSize),
        ch14: new Int32Array(this.bufferSize),
        ch15: new Int32Array(this.bufferSize),
      },
      ADC5: {
        ch0: new Int32Array(this.bufferSize),
        ch1: new Int32Array(this.bufferSize),
        ch2: new Int32Array(this.bufferSize),
        ch3: new Int32Array(this.bufferSize),
        ch4: new Int32Array(this.bufferSize),
        ch5: new Int32Array(this.bufferSize),
        ch6: new Int32Array(this.bufferSize),
        ch7: new Int32Array(this.bufferSize),
        ch8: new Int32Array(this.bufferSize),
        ch9: new Int32Array(this.bufferSize),
        ch10: new Int32Array(this.bufferSize),
        ch11: new Int32Array(this.bufferSize),
        ch12: new Int32Array(this.bufferSize),
        ch13: new Int32Array(this.bufferSize),
        ch14: new Int32Array(this.bufferSize),
        ch15: new Int32Array(this.bufferSize),
      },
      ADC6: {
        ch0: new Int32Array(this.bufferSize),
        ch1: new Int32Array(this.bufferSize),
        ch2: new Int32Array(this.bufferSize),
        ch3: new Int32Array(this.bufferSize),
        ch4: new Int32Array(this.bufferSize),
        ch5: new Int32Array(this.bufferSize),
        ch6: new Int32Array(this.bufferSize),
        ch7: new Int32Array(this.bufferSize),
        ch8: new Int32Array(this.bufferSize),
        ch9: new Int32Array(this.bufferSize),
        ch10: new Int32Array(this.bufferSize),
        ch11: new Int32Array(this.bufferSize),
        ch12: new Int32Array(this.bufferSize),
        ch13: new Int32Array(this.bufferSize),
        ch14: new Int32Array(this.bufferSize),
        ch15: new Int32Array(this.bufferSize),
      },
      ADC7: {
        ch0: new Int32Array(this.bufferSize),
        ch1: new Int32Array(this.bufferSize),
        ch2: new Int32Array(this.bufferSize),
        ch3: new Int32Array(this.bufferSize),
        ch4: new Int32Array(this.bufferSize),
        ch5: new Int32Array(this.bufferSize),
        ch6: new Int32Array(this.bufferSize),
        ch7: new Int32Array(this.bufferSize),
        ch8: new Int32Array(this.bufferSize),
        ch9: new Int32Array(this.bufferSize),
        ch10: new Int32Array(this.bufferSize),
        ch11: new Int32Array(this.bufferSize),
        ch12: new Int32Array(this.bufferSize),
        ch13: new Int32Array(this.bufferSize),
        ch14: new Int32Array(this.bufferSize),
        ch15: new Int32Array(this.bufferSize),
      },
      ADC8: {
        ch0: new Int32Array(this.bufferSize),
        ch1: new Int32Array(this.bufferSize),
        ch2: new Int32Array(this.bufferSize),
        ch3: new Int32Array(this.bufferSize),
        ch4: new Int32Array(this.bufferSize),
        ch5: new Int32Array(this.bufferSize),
        ch6: new Int32Array(this.bufferSize),
        ch7: new Int32Array(this.bufferSize),
        ch8: new Int32Array(this.bufferSize),
        ch9: new Int32Array(this.bufferSize),
        ch10: new Int32Array(this.bufferSize),
        ch11: new Int32Array(this.bufferSize),
        ch12: new Int32Array(this.bufferSize),
        ch13: new Int32Array(this.bufferSize),
        ch14: new Int32Array(this.bufferSize),
        ch15: new Int32Array(this.bufferSize),
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
    // Meta data obj
    const metadata: DeviceDataTypeWithMetaData['metadata'] = {
      timestamp: Date.now(),
    };

    const data = new Uint8Array(packet);
    const dataLength = data.length;
    const msbIndicesLength = this.msb_indices.length;

    let msbArrIndex = new Array(this.msb_indices.length).fill(0);
    let lsbArrIndex = new Array(this.msb_indices.length).fill(0);

    // Loops over the entire array buffer
    for (let i = 0; i < dataLength; i++) {
      // Find MSBs and LSBs
      for (let j = 0; j < msbIndicesLength; j++) {
        const channelIndex = 'ADC' + (j + 1);

        // Find MSBs
        if (i % this.bytes_count === this.msb_indices[j] - 0) {
          this.channelsLsbMsb[channelIndex as keyof ChannelsLsbMsbType].msb[msbArrIndex[j]] =
            data[i];
          msbArrIndex[j]++;
          continue;
        }

        // Find LSBs
        if (i % this.bytes_count === this.msb_indices[j] - 1) {
          this.channelsLsbMsb[channelIndex as keyof ChannelsLsbMsbType].lsb[lsbArrIndex[j]] =
            data[i];
          lsbArrIndex[j]++;
          continue;
        }
      }
    }

    // Bit shifts & data sort
    for (let i = 0; i < 512; i++) {
      for (let j = 0; j < 7; j++) {
        const ledNum = this.channelsLsbMsb['ADC8'].lsb[i];

        const channelIndex = 'ADC' + (j + 1);

        let d =
          this.channelsLsbMsb[channelIndex as keyof ChannelsLsbMsbType].lsb[i] +
          (this.channelsLsbMsb[channelIndex as keyof ChannelsLsbMsbType].msb[i] << 8);
        d = (d << 16) >> 16;

        this.res[channelIndex as keyof BeastParserDataType][
          `ch${ledNum}` as keyof BeastParserDataType['ADC1']
        ][i] = d;
      }
    }

    return { data: this.res, metadata };
  };
}
