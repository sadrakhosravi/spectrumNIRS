//@ts-nocheck
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  UpdateDateColumn,
} from 'typeorm';
import { Patients } from './Patients';

@Entity({ name: 'experiments' })
export class Experiments extends BaseEntity {
  @OneToMany(() => Patients, (patients) => patients.experiment)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'datetime', nullable: true })
  date: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

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

export default Experiments;
