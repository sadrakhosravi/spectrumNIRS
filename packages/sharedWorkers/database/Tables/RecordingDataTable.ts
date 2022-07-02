import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RecordingTable } from './RecordingTable';

export type NewRecordingType = {
  name: string;
  description?: string;
};

@Entity({ name: 'recording_data' })
export class RecordingDataTable {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'blob', nullable: false })
  data!: Blob;

  @ManyToOne(() => RecordingTable, (recordingTable) => recordingTable.recordingData, {
    onDelete: 'CASCADE',
  })
  recording!: number;
}
