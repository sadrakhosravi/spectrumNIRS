import type { DataSource } from 'typeorm';
import { serialize } from 'v8';
import type { DeviceInfoSavedType } from '@models/Device/api/device-api';
import { RecordingDataTable } from '../Tables/RecordingDataTable';
import { RecordingTable } from '../Tables/RecordingTable';

// Tables

const testBuff: Buffer[] = [];

export type SavedRecordingType = {
  id: number;
  name: string;
  description: string | null;
  devices: string | null;
  sensor: 'v5' | 'v6';
  settings: string | null;
  created_timestamp: number;
  updated_timestamp: number;
  is_active: number;
};

export type SavedRecordingParsedType = {
  id: number;
  name: string;
  description: string | null;
  devices: DeviceInfoSavedType[];
  settings: string | null;
  sensor: 'v5' | 'v6';
  created_timestamp: number;
  updated_timestamp: number;
  is_active: number;
};

export type RecordingDataType = {
  id: number;
  data: Buffer;
  recordingId: number;
};

export class RecordingQueries {
  private dataSource: DataSource;
  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  //// ---------------------- Selects ---------------------- ////

  /**
   * @returns the recording record from the database with the given id.
   */
  public async selectRecording(recordingId: number) {
    const recording = (await this.dataSource
      .createQueryBuilder()
      .select()
      .from(RecordingTable, '')
      .where('id = :id', { id: recordingId })
      .getRawOne()) as any;

    recording.devices = JSON.parse(recording.devices as string);

    return recording as SavedRecordingParsedType;
  }

  /**
   * @returns all recording records from the database.
   */
  public async selectAllRecordings() {
    const recordings = (await this.dataSource
      .createQueryBuilder()
      .select()
      .from(RecordingTable, '')
      .getRawMany()) as any;

    recordings.forEach(
      (recordings: any) =>
        (recordings.devices = JSON.parse(recordings.devices as string))
    );

    return recordings as SavedRecordingParsedType[];
  }

  /**
   * @returns the current active recording from the database.
   */
  public async selectActiveRecording() {
    return (await this.dataSource
      .createQueryBuilder()
      .select()
      .from(RecordingTable, '')
      .where('is_active = 1')
      .getRawOne()) as SavedRecordingType;
  }

  /**
   * @returns the devices and their settings store in the database for the given recording.
   */
  public async selectRecordingDevices(recordingId: string) {
    const devicesSettings = await this.dataSource
      .createQueryBuilder()
      .select('devices')
      .from(RecordingTable, '')
      .where('id = :id', { id: recordingId })
      .getRawOne();

    const deviceSettings = JSON.parse(
      devicesSettings.devices
    ) as DeviceInfoSavedType[];

    console.log(deviceSettings);
    return deviceSettings;
  }

  /**
   * @returns the recording data for the given recording Id and limits the queried results.
   */
  public async selectRecordingData(
    recordingId: number,
    limit: number,
    offset?: number
  ) {
    return (await this.dataSource
      .createQueryBuilder()
      .select('data')
      .from(RecordingDataTable, '')
      .where('recordingId = :id', { id: recordingId })
      .limit(limit)
      .offset(offset)
      .getRawMany()) as RecordingDataType[];
  }

  //// ---------------------- Inserts ---------------------- ////

  /**
   * Inserts a new recording in the database.
   * @returns the new recording record that was created in the database.
   */
  public async insertRecording(recording: {
    name: string;
    sensor: 'v5' | 'v6';
    has_data: 0 | 1;
    description?: string;
  }) {
    const ts = Date.now();

    // Remove any active recordings first.
    await this.removeActiveRecording();

    // Create the recording.
    const record = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(RecordingTable)
      .values({
        name: recording.name,
        description: recording.description || '',
        created_timestamp: ts,
        updated_timestamp: ts,
        has_data: recording.has_data,
        sensor: recording.sensor,
        is_active: 1,
      })
      .execute();

    // Return the created recording.
    return await this.selectRecording(record.raw);
  }

  /**
   * Inserts the device data in the database for testing.
   * Only works with recording id = 1
   */
  public async insertTestDeviceData(data: Buffer) {
    testBuff.push(data);

    if (testBuff.length === 50) {
      const dataCompressed = (await serialize(testBuff)) as Buffer;

      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(RecordingDataTable)
        .values({
          data: dataCompressed,
          recording: 1,
        })
        .execute();

      testBuff.length = 0;
    }
  }

  //// ---------------------- Updates ---------------------- ////

  /**
   * Updates the given recording's devices column and its updated timestamp.
   * @returns the updated record.
   */
  public async updateRecordingDevices(
    devicesSettings: DeviceInfoSavedType[],
    recordingId: number
  ) {
    const ts = Date.now();

    await this.dataSource
      .createQueryBuilder()
      .update(RecordingTable)
      .set({
        devices: JSON.stringify(devicesSettings),
        updated_timestamp: ts,
      })
      .where('id = :id', { id: recordingId })
      .execute();
  }

  /**
   * Updates the recording database record.
   */
  public async removeActiveRecording() {
    const allRecords = await this.selectAllRecordings();

    allRecords.forEach(async (record) => {
      await this.dataSource
        .createQueryBuilder()
        .update(RecordingTable)
        .set({
          is_active: 0,
        })
        .where('id = :id', { id: record.id })
        .execute();
    });
  }

  //// ---------------------- Delete ---------------------- ////

  /**
   * Deleted the given recording by its id
   */
  public async deleteRecording(recordingId: number) {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(RecordingTable)
      .where('id = :id', { id: recordingId })
      .execute();

    await this.vacuum();
  }

  //// ---------------------- Others ---------------------- ////
  /**
   * Vacuums the database and restarts the WAL checkpoint.
   */
  public async vacuum() {
    await this.dataSource.query('VACUUM');
    await this.dataSource.query('PRAGMA wal_checkpoint(RESTART)');
  }
}
