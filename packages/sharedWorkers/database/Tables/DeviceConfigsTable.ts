import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import type { IDeviceConfig } from '../../../renderer/reader/Interfaces';

// Tables
import { DevicesTable } from './DevicesTable';

export type NewRecordingType = {
  name: string;
  description?: string;
};

@Entity({ name: 'device_configs' })
export class DeviceConfigsTable {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'text', nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'blob', nullable: true })
  settings!: string | IDeviceConfig;

  @Column({ type: 'integer', nullable: false })
  created_timestamp!: number;

  @Column({ type: 'integer', nullable: false })
  updated_timestamp!: number;

  @Column({ type: 'tinyint', nullable: false })
  is_active!: 1 | 0;

  @ManyToOne(() => DevicesTable, (deviceTable) => deviceTable.configs)
  device!: number;
}
