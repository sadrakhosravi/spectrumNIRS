//@ts-nocheck
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import Probes from './Probes';

@Entity({ name: 'sensors' })
export class Sensors extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'int' })
  LEDs: number;

  @Column({ type: 'int' })
  PDs: number;

  @Column({ type: 'int' })
  defaultSamplingRate: number;

  @Column({ type: 'int' })
  maxSamplingRate: number;

  @Column({ type: 'text', nullable: true })
  defaultIntensities: string;

  @Column({ type: 'text', nullable: true })
  preGains: string;

  @Column({ type: 'text', nullable: true })
  defaultGain: string;

  @Column({ type: 'text', nullable: true })
  defaultChannels: string;

  @Column({ type: 'text', unique: true, nullable: true })
  driverName: string;

  @OneToMany((type) => Probes, (probes) => probes.sensor)
  @JoinColumn() // this decorator is optional for @ManyToOne, but required for @OneToOne
  probes: Probes[];

  @CreateDateColumn({ type: 'datetime' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updatedAt: Date;
}

export default Sensors;
