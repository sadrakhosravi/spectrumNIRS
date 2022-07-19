import { serialize } from 'v8';
import AccurateTimer from '@utils/helpers/AccurateTimer';
import Snappy from 'snappy';

// Types
import type { DeviceDataTypeWithMetaData } from '@models/Device/api/Types';
import type { DataSource } from './types/Types';
import { RecordingDataTable } from './Tables/RecordingDataTable';

type RawDataWithMetaType = {
  data: Buffer;
  metadata: DeviceDataTypeWithMetaData['metadata'];
};

type DataType = {
  [key: string]: RawDataWithMetaType[];
};

export class DatabaseDeviceDataManager {
  private readonly dataSource: DataSource;
  private data: DataType;
  /**
   * The data saving interval loop.
   */
  private readonly dataSavingLoop: AccurateTimer;
  /**
   * The recording id foreign key.
   */
  private recordingId: number;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.data = {};
    this.recordingId = 0;

    this.dataSavingLoop = new AccurateTimer(
      this.handleDataSave.bind(this),
      5 * 1000
    );
  }

  /**
   * Starts data saving loop.
   */
  public start(deviceNames: string[], recordingId: number) {
    deviceNames.forEach((name) => (this.data[name] = []));
    this.recordingId = recordingId;

    this.dataSavingLoop.start();
  }

  /**
   * Stops the data saving loop and saves the remaining buffered data.
   */
  public stop() {
    this.dataSavingLoop.stop();
  }

  /**
   * Adds the device data to the internal buffer.
   */
  public addData(deviceName: string, data: RawDataWithMetaType[]) {
    this.data[deviceName].push(...data);
  }

  private async handleDataSave() {
    console.time('writedata');
    if (this.data['Beast'].length === 0) return;

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

    for (const key in this.data) {
      this.data[key] = [];
    }

    //@ts-ignore
    global.gc();

    console.timeEnd('writedata');
  }
}
