//@ts-nocheck

import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Patients } from 'db/entity/Patients';
import { RecordingsData } from 'db/entity/RecordingsData';

@Entity()
export class Recordings extends BaseEntity {
  @OneToMany(() => RecordingsData, RecordingsData.recording)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: Date;

  @Column({ type: 'datetime', nullable: true })
  date: Date;

  @Column({ type: 'blob', nullable: true })
  settings: JSON;

  @ManyToOne(() => Patients)
  patient: Patients;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
