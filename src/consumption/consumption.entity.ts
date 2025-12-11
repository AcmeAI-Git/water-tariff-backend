import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ApprovalStatus } from '../approval-status/approval-status.entity';
import { Admin } from 'src/admins/admin.entity';

@Entity('consumption')
export class Consumption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'created_by' })
  createdBy: number;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'created_by' })
  creator: Admin;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: number;

  @ManyToOne(() => Admin, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approver: Admin;

  @Column({ name: 'approval_status_id' })
  approvalStatusId: number;

  @ManyToOne(() => ApprovalStatus)
  @JoinColumn({ name: 'approval_status_id' })
  approvalStatus: ApprovalStatus;

  @Column({ type: 'date', name: 'bill_month' })
  billMonth: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'current_reading' })
  currentReading: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'previous_reading',
    nullable: true,
  })
  previousReading: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  consumption: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  calculateConsumption() {
    if (this.currentReading && this.previousReading) {
      this.consumption =
        Number(this.currentReading) - Number(this.previousReading);
    }
  }
}
