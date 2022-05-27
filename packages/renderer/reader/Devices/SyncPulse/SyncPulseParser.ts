import { IDeviceParser } from '../../api/device-api';

// Type
import type { DeviceADCDataType, DeviceDataTypeWithMetaData } from '../../models/Types';

export type UnpackedDataType = {
  [key: string]: number[];
};

enum SyncStatus {
  INFO = '[INF]',
  SYNC = '[SNC]',
  ERROR = '[ERR]',
}

enum PinStatus {
  UP = 'UP',
  DOWN = 'DN',
}

export class SyncPulseParser implements IDeviceParser {
  private dataBuff: DeviceDataTypeWithMetaData[];
  constructor() {
    this.dataBuff = [];
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

    // Create the result obj
    const res: DeviceADCDataType = {
      ch1: {
        led0: [],
      },
    };

    // Split the data
    const splittedStr = packet.split(' ');

    // Check for errors
    const dataStatus = splittedStr[0];

    // Check for error status
    if (dataStatus === SyncStatus.ERROR) {
      console.log(packet.slice(5));
    }

    // Check for info status
    if (dataStatus === SyncStatus.INFO) {
      console.log(splittedStr[2]);
    }

    // Check for sync pulse status
    if (dataStatus === SyncStatus.SYNC) {
      // const timeInMS = splittedStr[1];
      // const syncNumber = splittedStr[3];
      const pinStatus = splittedStr[4];

      if (pinStatus === PinStatus.UP) {
        res.ch1.led0.push(0, 5);
      }

      if (pinStatus === PinStatus.DOWN) {
        res.ch1.led0.push(5, 0);
      }
    }

    // // Add to internal buffer
    this.dataBuff.push({ data: res, metadata });

    // Check for memory leaks`
    if (this.dataBuff.length > 25) {
      // Something has gone wrong here, avoid memory leaks
      this.dataBuff.length = 0;
    }
  };
}
