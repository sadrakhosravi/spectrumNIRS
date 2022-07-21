import { serialize } from 'v8';
import Snappy from 'snappy';

// Types
import type { DeviceDataTypeWithMetaData } from '@models/Device/api/Types';
import type { DataSource } from './types/Types';
import { RecordingDataTable } from './Tables/RecordingDataTable';

type DataType = {
  Beast: {
    ADC1: {
      [key: string]: number[];
    };
    ADC2: {
      [key: string]: number[];
    };
  };
};

export class DatabaseDeviceDataManager {
  private readonly dataSource: DataSource;
  private data: DataType;
  /**
   * The recording id foreign key.
   */
  private recordingId: number;
  addData: (data: DeviceDataTypeWithMetaData[]) => Promise<void>;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.data = {
      Beast: {
        ADC1: {
          ch0: [],
          ch1: [],
          ch2: [],
          ch3: [],
          ch4: [],
          ch5: [],
          ch6: [],
          ch7: [],
          ch8: [],
          ch9: [],
          ch10: [],
          ch11: [],
          ch12: [],
          ch13: [],
          ch14: [],
          ch15: [],
        },
        ADC2: {
          ch0: [],
          ch1: [],
          ch2: [],
          ch3: [],
          ch4: [],
          ch5: [],
          ch6: [],
          ch7: [],
          ch8: [],
          ch9: [],
          ch10: [],
          ch11: [],
          ch12: [],
          ch13: [],
          ch14: [],
          ch15: [],
        },
      },
    };
    this.recordingId = 0;

    this.addData = this.addDataV5;
  }

  /**
   * Starts data saving loop.
   */
  public start(
    _deviceNames: string[],
    recordingId: number,
    sensorType: 'v5' | 'v6'
  ) {
    console.log('Start Database');
    this.recordingId = recordingId;

    if (sensorType === 'v5') this.addData = this.addDataV5;
    if (sensorType === 'v6') this.addData = this.addDataV6;
  }

  /**
   * Stops the data saving loop and saves the remaining buffered data.
   */
  public async stop() {
    console.log('Stop Database');

    await this.handleDataSave();
  }

  /**
   * Adds the device data to the internal buffer.
   */
  public async addDataV6(data: DeviceDataTypeWithMetaData[]) {
    data.forEach((dataPacket) => {
      // Add each channel to the buffer.
      this.data.Beast.ADC1.ch0.push(...dataPacket.data.ADC1.ch0);
      this.data.Beast.ADC1.ch1.push(...(dataPacket.data.ADC1 as any).ch1);
      this.data.Beast.ADC1.ch2.push(...(dataPacket.data.ADC1 as any).ch2);
      this.data.Beast.ADC1.ch3.push(...(dataPacket.data.ADC1 as any).ch3);
      this.data.Beast.ADC1.ch4.push(...(dataPacket.data.ADC1 as any).ch4);
      this.data.Beast.ADC1.ch5.push(...(dataPacket.data.ADC1 as any).ch5);
      this.data.Beast.ADC1.ch6.push(...(dataPacket.data.ADC1 as any).ch6);
      this.data.Beast.ADC1.ch7.push(...(dataPacket.data.ADC1 as any).ch7);
      this.data.Beast.ADC1.ch8.push(...(dataPacket.data.ADC1 as any).ch8);

      // Add each channel to the buffer.
      this.data.Beast.ADC2.ch0.push(...(dataPacket.data.ADC2 as any).ch0);
      this.data.Beast.ADC2.ch1.push(...(dataPacket.data.ADC2 as any).ch1);
      this.data.Beast.ADC2.ch2.push(...(dataPacket.data.ADC2 as any).ch2);
      this.data.Beast.ADC2.ch3.push(...(dataPacket.data.ADC2 as any).ch3);
      this.data.Beast.ADC2.ch4.push(...(dataPacket.data.ADC2 as any).ch4);
      this.data.Beast.ADC2.ch5.push(...(dataPacket.data.ADC2 as any).ch5);
      this.data.Beast.ADC2.ch6.push(...(dataPacket.data.ADC2 as any).ch6);
      this.data.Beast.ADC2.ch7.push(...(dataPacket.data.ADC2 as any).ch7);
      this.data.Beast.ADC2.ch8.push(...(dataPacket.data.ADC2 as any).ch8);
    });

    // Commit data on 5 sec of data.
    if (this.data.Beast.ADC1.ch0.length >= 224 * 10)
      await this.handleDataSave();
  }

  /**
   * Adds the device data to the internal buffer.
   */
  public async addDataV5(data: DeviceDataTypeWithMetaData[]) {
    data.forEach((dataPacket) => {
      // Add each channel to the buffer.
      this.data.Beast.ADC1.ch0.push(...dataPacket.data.ADC1.ch0);
      this.data.Beast.ADC1.ch11.push(...(dataPacket.data.ADC1 as any).ch11);
      this.data.Beast.ADC1.ch12.push(...(dataPacket.data.ADC1 as any).ch12);
      this.data.Beast.ADC1.ch13.push(...(dataPacket.data.ADC1 as any).ch13);
      this.data.Beast.ADC1.ch14.push(...(dataPacket.data.ADC1 as any).ch14);
      this.data.Beast.ADC1.ch15.push(...(dataPacket.data.ADC1 as any).ch15);
    });

    // Commit data on 5 sec of data.
    if (this.data.Beast.ADC1.ch0.length >= 224 * 10)
      await this.handleDataSave();
  }

  private async handleDataSave() {
    const dataSerialized = serialize(this.data);
    const compressed = Snappy.compressSync(dataSerialized);
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(RecordingDataTable)
      .values({
        data: compressed,
        recording: this.recordingId,
      })
      .execute();

    for (const ADC in this.data.Beast) {
      //@ts-ignore
      for (const channel in this.data.Beast[ADC]) {
        //@ts-ignore
        this.data.Beast[ADC][channel].length = 0;
      }
    }

    //@ts-ignore
    setTimeout(() => global.gc(), 500);
  }
}
