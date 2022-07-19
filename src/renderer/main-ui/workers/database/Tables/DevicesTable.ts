import { Entity, Column, OneToMany } from 'typeorm';
import { DeviceConfigsTable } from './DeviceConfigsTable';

// Tables

export type NewRecordingType = {
  name: string;
  description?: string;
};

@Entity({ name: 'devices' })
export class DevicesTable {
  @Column({ type: 'tinyint', primary: true, nullable: false })
  id!: number;

  @Column({ type: 'text', nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'blob', nullable: true })
  settings!: Blob | null;

  @Column({ type: 'integer', nullable: false })
  created_timestamp!: number;

  @Column({ type: 'integer', nullable: false })
  updated_timestamp!: number;

  @OneToMany(() => DeviceConfigsTable, (deviceConfigs) => deviceConfigs.device)
  configs!: number;
}
