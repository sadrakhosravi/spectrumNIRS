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

  @Column({ type: 'float' })
  O2Hb: number;

  @Column({ type: 'float' })
  HHb: number;

  @Column({ type: 'float' })
  THb: number;

  @Column({ type: 'float' })
  TOI: number;

  @Column({ type: 'text', nullable: true })
  PDRawData: string;

  @Column({ type: 'text', nullable: true })
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
