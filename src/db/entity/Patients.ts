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

  @UpdateDateColumn({ select: false })
  public updatedAt: Date;
}

export default Patients;
