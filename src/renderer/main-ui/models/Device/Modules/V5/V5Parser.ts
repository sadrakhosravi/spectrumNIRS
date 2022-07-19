import { IDeviceParser } from '../../api/device-api';

// Type
import type { DeviceDataTypeWithMetaData } from '../../api/Types';

export type UnpackedDataType = {
  [key: string]: number[];
};

export type V5ParserDataType = {
  ADC1: {
    ch0: Int32Array;
    ch1: Int32Array;
    ch2: Int32Array;
    ch3: Int32Array;
    ch4: Int32Array;
    ch5: Int32Array;
  };
};

export class V5Parser implements IDeviceParser {
  /**
   * The number of data points per packet.
   */
  private BATCH_SIZE: number;
  constructor() {
    this.BATCH_SIZE = 10;
  }

  /**
   * Sets the total active PD number.
   */
  public setPDNum = (num: number) => {
    // this.pd_num = num;
    console.log('Parser PD Number updated: ' + num);
  };

  public createResObj() {
    return {
      ADC1: {
        ch0: new Int32Array(this.BATCH_SIZE),
        ch1: new Int32Array(this.BATCH_SIZE),
        ch2: new Int32Array(this.BATCH_SIZE),
        ch3: new Int32Array(this.BATCH_SIZE),
        ch4: new Int32Array(this.BATCH_SIZE),
        ch5: new Int32Array(this.BATCH_SIZE),
      },
    };
  }

  /**
   * Processes the incoming data packet and return an object.
   * @param packet the packet received from the hardware.
   * @returns an object containing the processed data of all the channels of beast hardware.
   */
  public processPacket = (packet: string) => {
    // Add meta data to each packet
    const metadata: DeviceDataTypeWithMetaData['metadata'] = {
      timestamp: Date.now(),
    };

    const res = this.createResObj();

    const lines = packet.split('\r\n');

    for (let i = 0; i < this.BATCH_SIZE; i += 1) {
      const data = lines[i].split(',');

      res.ADC1.ch0[i] = ~~data[5];
      res.ADC1.ch1[i] = ~~data[0];
      res.ADC1.ch2[i] = ~~data[1];
      res.ADC1.ch3[i] = ~~data[2];
      res.ADC1.ch4[i] = ~~data[3];
      res.ADC1.ch5[i] = ~~data[4];
    }

    // Add to internal buffer
    return { data: res, metadata, buffer: packet };
  };
}
