//@ts-nocheck
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'probes' })
export class Probes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  LEDs: string;

  @Column({ type: 'int' })
  defaultSamplingRate: number;

  @Column({ type: 'int', nullable: true })
  savedSamplingRate: number;

  @Column({ type: 'text', nullable: true })
  defaultIntensities: string;

  @Column({ type: 'text', nullable: true })
  savedIntensities: string;

  @Column({ type: 'text', nullable: true })
  defaultGain: string;

  @Column({ type: 'text', nullable: true })
  defaultChannels: string;

  @Column({ type: 'text', nullable: true })
  savedChannels: string;

  @Column({ type: 'text', nullable: true })
  driver: string;

  @CreateDateColumn({ type: 'datetime' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updatedAt: Date;
}

export default Probes;
