import { IDeviceParser } from '../../api/device-api';
import Avro from 'avsc';

// Type
import type { DeviceADCDataType, DeviceDataTypeWithMetaData } from '../../models/Types';

export type UnpackedDataType = {
  [key: string]: number[];
};

export class V5Parser implements IDeviceParser {
  private dataBuff: DeviceDataTypeWithMetaData[];
  /**
   * The number of data points per packet.
   */
  private BATCH_SIZE: number;
  /**
   * The number of PD Channels
   */
  private PD_CHANNELS: number;
  /**
   * Data serializer
   */
  protected serializer: Avro.Type;
  constructor() {
    this.dataBuff = [];
    this.BATCH_SIZE = 10;
    this.PD_CHANNELS = 6;

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
   * @returns the data buffer and frees the data from the parser memory.
   */
  public getData() {
    return this.dataBuff.splice(0);
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

    const res: DeviceADCDataType = {
      ch1: {},
    };

    const lines = packet.split('\r\n');

    // Create each LED for each channel.
    for (let i = 0; i < this.PD_CHANNELS; i++) {
      res['ch1'][`led${i}`] = [];
    }

    for (let i = 0; i < this.BATCH_SIZE; i += 1) {
      const data = lines[i].split(',');

      res.ch1['led0'].push(~~data[5]);
      res.ch1['led1'].push(~~data[0]);
      res.ch1['led2'].push(~~data[1]);
      res.ch1['led3'].push(~~data[2]);
      res.ch1['led4'].push(~~data[3]);
      res.ch1['led5'].push(~~data[4]);
    }

    // Add to internal buffer
    this.dataBuff.push({ data: res, metadata });

    // Check for memory leaks`
    if (this.dataBuff.length > 25) {
      // Something has gone wrong here, avoid memory leaks
      this.dataBuff.length = 0;
    }
  };
}
