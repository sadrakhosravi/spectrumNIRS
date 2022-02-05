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

import { Patients } from './Patients';
import { RecordingsData } from './RecordingsData';

@Entity({ name: 'recordings' })
export class Recordings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: Date;

  @Column({ type: 'datetime', nullable: true })
  date: Date;

  @Column({ type: 'blob', nullable: true })
  settings: JSON | string;

  @ManyToOne(() => Patients, { onDelete: 'CASCADE' })
  patient: Patients | number;

  @CreateDateColumn({ select: false })
  public createdAt: Date;

  @UpdateDateColumn({ select: false })
  public updatedAt: Date;
}
export default Recordings;
