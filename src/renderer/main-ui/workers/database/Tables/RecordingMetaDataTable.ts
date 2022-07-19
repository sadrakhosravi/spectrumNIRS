import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RecordingTable } from './RecordingTable';

@Entity({ name: 'recording_metadata' })
export class RecordingMetaDataTable {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'blob', nullable: false })
  data!: string;

  @ManyToOne(() => RecordingTable, (recordingTableId) => recordingTableId.id, {
    onDelete: 'CASCADE',
  })
  recording!: RecordingTable;
}
