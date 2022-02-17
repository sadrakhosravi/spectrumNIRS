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

  @Column({ type: 'float' })
  timeStamp: number;

  @Column({ type: 'text' })
  PDRawData: string;

  @Column({ type: 'text' })
  LEDIntensities: string;

  @Column({ type: 'text', nullable: true })
  gainValues: string;

  @Column({ type: 'tinyint', nullable: true })
  event: number;

  @Column({ type: 'text', nullable: true })
  events: string;

  @Column({ type: 'text', nullable: true })
  sensor2RawData: string;

  @Column({ type: 'text', nullable: true })
  sensor3RawData: string;

  @ManyToOne(() => Recordings, {
    select: false,
    onDelete: 'CASCADE',
  })
  recording: Recordings;
}

export default RecordingsData;
