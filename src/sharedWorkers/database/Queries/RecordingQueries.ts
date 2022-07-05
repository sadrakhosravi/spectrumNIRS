import type { DataSource } from 'typeorm';
import { serialize } from 'v8';
import type { DeviceInfoSavedType } from '../../../renderer/reader/api/device-api';
import { RecordingDataTable } from '../Tables/RecordingDataTable';
import { RecordingTable } from '../Tables/RecordingTable';

// Tables

const testBuff: Buffer[] = [];

export type SavedRecordingType = {
  id: string;
  name: string;
  description: string | null;
  devices: string | null;
  settings: string | null;
  created_timestamp: number;
  updated_timestamp: number;
  is_active: number;
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
    return (await this.dataSource
      .createQueryBuilder()
      .select()
      .from(RecordingTable, '')
      .where('id = :id', { id: recordingId })
      .getRawOne()) as SavedRecordingType;
  }

  /**
   * @returns all recording records from the database.
   */
  public async selectAllRecordings() {
    return (await this.dataSource
      .createQueryBuilder()
      .select()
      .from(RecordingTable, '')
      .getRawMany()) as SavedRecordingType[];
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

  //// ---------------------- Inserts ---------------------- ////

  /**
   * Inserts a new recording in the database.
   * @returns the new recording record that was created in the database.
   */
  public async insertRecording(recording: {
    name: string;
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
        is_active: 1,
      })
      .execute();

    // Return the created recording.
    return await this.selectRecording(record.raw);
  }

  //// ---------------------- Updates ---------------------- ////

  /**
   * Updates the given recording's devices column and its updated timestamp.
   * @returns the updated record.
   */
  public async updateRecordingDevices(
    devicesSettings: DeviceInfoSavedType[],
    recordingId: string
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
}
