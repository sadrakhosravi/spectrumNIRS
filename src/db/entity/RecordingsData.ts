//@ts-nocheck

import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Recordings } from 'db/entity/Recordings';

@Entity()
export class RecordingsData extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  values: string;

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

  @Column({ type: 'tinyint', nullable: true })
  hypoxia: string;

  @Column({ type: 'tinyint', nullable: true })
  event2: string;

  @ManyToOne(() => Recordings)
  recording: Recordings;
}
