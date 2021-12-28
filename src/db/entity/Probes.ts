//@ts-nocheck
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import Sensor from './Sensors';

@Entity({ name: 'probes' })
export class Probes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  intensities: string;

  @Column({ type: 'text' })
  preGain: string;

  @Column({ type: 'int' })
  gain: number;

  @Column({ type: 'int' })
  samplingRate: number;

  @Column({ type: 'tinyint', nullable: true })
  isDefault: number;

  @Column({ type: 'text', nullable: true })
  lastUpdate: string;

  @ManyToOne((type) => Sensor, (sensor) => sensor.probes, { cascade: true })
  @JoinColumn() // this decorator is optional for @ManyToOne, but required for @OneToOne
  sensor: number;

  @CreateDateColumn({ type: 'datetime' })
  public createdAt: Date;

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

export default Probes;
