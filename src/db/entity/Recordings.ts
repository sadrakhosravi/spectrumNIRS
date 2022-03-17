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
  BeforeInsert,
  BeforeUpdate,
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
  description: string;

  @Column({ type: 'int', nullable: true })
  startTime: number;

  @Column({ type: 'int', nullable: true })
  endTime: number;

  @Column({ type: 'blob', nullable: true })
  deviceSettings: string;

  @Column({ type: 'blob', nullable: true })
  probeSettings: string;

  @Column({ type: 'blob', nullable: true })
  settings: JSON | string | any;

  @Column({ type: 'blob', nullable: true })
  other: string;

  @ManyToOne(() => Patients, { onDelete: 'CASCADE' })
  patient: Patients | number;

  @CreateDateColumn({ select: false })
  public createdAt: Date;

  @Column({ type: 'text', nullable: true })
  lastUpdate: string;

  @UpdateDateColumn({ type: 'datetime' })
  public updatedAt: Date;

  @BeforeInsert()
  private setlastUpdate(): void {
    this.lastUpdate = new Date().toLocaleString('en-US', {
      hour12: false,
    });
  }
  @BeforeUpdate()
  private setlastUpdate(): void {
    this.lastUpdate = new Date().toLocaleString('en-US', {
      hour12: false,
    });
  }
}
export default Recordings;
