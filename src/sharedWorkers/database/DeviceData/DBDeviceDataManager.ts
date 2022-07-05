/*---------------------------------------------------------------------------------------------
 *  Database device data manager class.
 *  Handles the incoming device data, compresses them, and inserts them to the database.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import AccurateTimer from '../../../utils/helpers/AccurateTimer';

// Types
import type { DataSource } from 'typeorm';
import { RecordingDataTable } from '../Tables/RecordingDataTable';
import { serialize } from 'v8';

export class DBDeviceDataManager {
  private connection: DataSource;
  private insertInterval: AccurateTimer;
  private data: any[];
  constructor(connection: DataSource) {
    this.connection = connection;
    this.insertInterval = new AccurateTimer(
      this.insertDeviceData.bind(this),
      5 * 1000
    );

    this.data = [];
  }

  /**
   * Starts the data insertion interval.
   */
  public start() {
    console.log('Started');
    this.insertInterval.start();
  }

  /**
   * Stops the data insertion interval and inserts the leftover data.
   */
  public stop() {
    this.insertInterval.stop();
    process.nextTick(() => this.insertInterval.stop());
  }

  /**
   * Adds data to the data array to be inserted in the database.
   */
  public addDeviceData(data: any, deviceName: string) {
    this.data.push({ device: deviceName, data });
  }

  /**
   * Inserts the device data buffered to the database and empties the buffer.
   */
  private async insertDeviceData() {
    const dataStr = serialize(this.data.splice(0));
    console.log(dataStr);

    this.connection
      .createQueryBuilder()
      .insert()
      .into(RecordingDataTable)
      .values({ data: dataStr, recording: 1 })
      .execute();
  }
}
