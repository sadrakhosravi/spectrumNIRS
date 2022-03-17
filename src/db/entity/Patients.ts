//@ts-nocheck

import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Experiments } from './Experiments';
import { Recordings } from './Recordings';

@Entity({ name: 'patients' })
export class Patients extends BaseEntity {
  @OneToMany(() => Recordings, (recordings) => recordings.patient)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({ type: 'text' })
  description: Date;

  @ManyToOne(() => Experiments, { onDelete: 'CASCADE' })
  experiment: Experiments;

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

export default Patients;
