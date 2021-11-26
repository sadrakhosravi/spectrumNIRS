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
import { Experiments } from 'db/entity/Experiments';
import { Recordings } from 'db/entity/Recordings';

@Entity()
export class Patients extends BaseEntity {
  @OneToMany(() => Recordings, Recordings.patient)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({ type: 'text' })
  description: Date;

  @ManyToOne(() => Experiments)
  experiment: Experiments;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
