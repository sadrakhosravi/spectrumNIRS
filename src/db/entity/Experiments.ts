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
import { Patients } from 'db/entity/Patients';

@Entity()
export class Experiments extends BaseEntity {
  @OneToMany(() => Patients, Patients.experiment)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'datetime', nullable: true })
  date: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'datetime' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updatedAt: Date;
}
