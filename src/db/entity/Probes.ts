//@ts-nocheck
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'probes' })
export class Probes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'blob' })
  intensities: any;

  @Column({ type: 'text' })
  preGain: string;

  @Column({ type: 'int' })
  gain: number;

  @Column({ type: 'int' })
  samplingRate: number;

  @Column({ type: 'text', nullable: true })
  channels: string;

  @Column({ type: 'text', nullable: true })
  channelColors: string;

  @Column({ type: 'tinyint', nullable: true })
  isDefault: number;

  @Column({ type: 'tinyint', nullable: true })
  deviceId: number;

  @Column({ type: 'text', nullable: true })
  lastUpdate: string;

  @CreateDateColumn({ type: 'datetime', select: false })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', select: false })
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
