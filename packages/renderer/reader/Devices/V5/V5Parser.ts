import { IDeviceParser } from '../../api/device-api';
import Avro from 'avsc';

// Type
import type { DeviceDataTypeWithMetaData, DeviceADCDataType } from '../../models/Types';

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
  /**
   * The result object after data has been parsed
   */
  private res: DeviceADCDataType & V5ParserDataType;
  /**
   * Data serializer
   */
  protected serializer: Avro.Type;
  constructor() {
    this.BATCH_SIZE = 10;

    this.res = {
      ADC1: {
        ch0: new Int32Array(this.BATCH_SIZE),
        ch1: new Int32Array(this.BATCH_SIZE),
        ch2: new Int32Array(this.BATCH_SIZE),
        ch3: new Int32Array(this.BATCH_SIZE),
        ch4: new Int32Array(this.BATCH_SIZE),
        ch5: new Int32Array(this.BATCH_SIZE),
      },
    };

    this.serializer = Avro.Type.forValue(
      {
        ch1: {
          led0: [1020, 7000, 1000, 1223, 123, 12313, 12315, 12357, 12345, 12345],
          led1: [1020, 7000, 1000, 1223, 123, 12313, 12315, 12357, 12345, 12345],
          led2: [1020, 7000, 1000, 1223, 123, 12313, 12315, 12357, 12345, 12345],
          led3: [1020, 7000, 1000, 1223, 123, 12313, 12315, 12357, 12345, 12345],
          led4: [1020, 7000, 1000, 1223, 123, 12313, 12315, 12357, 12345, 12345],
          led5: [1020, 7000, 1000, 1223, 123, 12313, 12315, 12357, 12345, 12345],
        },
      },
      {
        omitRecordMethods: true,
      },
    );
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
  public processPacket = (packet: string) => {
    // Add meta data to each packet
    const metadata: DeviceDataTypeWithMetaData['metadata'] = {
      timestamp: Date.now(),
    };

    const lines = packet.split('\r\n');

    for (let i = 0; i < this.BATCH_SIZE; i += 1) {
      const data = lines[i].split(',');

      this.res.ADC1['ch0'][i] = ~~data[5];
      this.res.ADC1['ch1'][i] = ~~data[0];
      this.res.ADC1['ch2'][i] = ~~data[1];
      this.res.ADC1['ch3'][i] = ~~data[2];
      this.res.ADC1['ch4'][i] = ~~data[3];
      this.res.ADC1['ch5'][i] = ~~data[4];
    }

    // Add to internal buffer
    return { data: this.res, metadata };
  };
}
