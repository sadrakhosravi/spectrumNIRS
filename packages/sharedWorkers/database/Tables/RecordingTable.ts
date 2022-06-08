import { Entity, Column } from 'typeorm';

export type NewRecordingType = {
  name: string;
  description?: string;
};

@Entity({ name: 'recordings' })
export class RecordingTable {
  @Column({ primary: true, type: 'varchar', nullable: false, unique: true })
  id!: number;

  @Column({ type: 'text', nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'blob', nullable: true })
  devices!: Blob;

  @Column({ type: 'blob', nullable: true })
  settings!: Blob;

  @Column({ type: 'integer', nullable: false })
  created_timestamp!: number;

  @Column({ type: 'integer', nullable: false })
  updated_timestamp!: number;

  @Column({ type: 'tinyint', nullable: false })
  isActive!: 0 | 1;
}
