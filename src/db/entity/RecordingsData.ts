//@ts-nocheck

import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Recordings } from './Recordings';

@Entity({ name: 'recordings_data' })
export class RecordingsData extends BaseEntity {
  @PrimaryGeneratedColumn({ select: false })
  id: number;

  @Column({ type: 'int' })
  timeSequence: number;

  @Column({ type: 'blob' })
  data: any;

  @Column({ type: 'blob', nullable: true })
  events: any;

  @Column({ type: 'blob', nullable: true })
  other: any;

  @Column({ type: 'bigint', nullable: true })
  timeStamp: BigInt;

  @ManyToOne(() => Recordings, {
    select: false,
    onDelete: 'CASCADE',
  })
  recording: Recordings;
}

export default RecordingsData;
