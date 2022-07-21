import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RecordingDataTable } from './RecordingDataTable';

// Types
import type { DeviceInfoSavedType } from '@models/Device/api/device-api';

export type NewRecordingType = {
  name: string;
  description?: string;
};

export type ChannelSettingsType = {
  name: string;
  color: string;
  gain: number;
  deviceName: string;
};

export type FilterSettings = {
  fc: number;
  order: number;
  type: 'butterworth';
};

@Entity({ name: 'recordings' })
export class RecordingTable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'blob', nullable: true })
  devices!: string | DeviceInfoSavedType[];

  @Column({ type: 'text', nullable: false })
  sensor!: 'v5' | 'v6';

  @Column({ type: 'blob', nullable: true })
  chartSettings!: string | DeviceInfoSavedType[];

  @Column({ type: 'blob', nullable: true })
  filterSettings!: string | DeviceInfoSavedType[];

  @Column({ type: 'blob', nullable: true })
  settings!: Blob;

  @Column({ type: 'tinyint', nullable: false })
  has_data!: 0 | 1;

  @Column({ type: 'integer', nullable: false })
  created_timestamp!: number;

  @Column({ type: 'integer', nullable: false })
  updated_timestamp!: number;

  @Column({ type: 'tinyint', nullable: false })
  is_active!: 0 | 1;

  @OneToMany(
    () => RecordingDataTable,
    (recordingData) => recordingData.recording
  )
  recordingData!: number;
}