import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Admin } from '../admins/admin.entity';
import { ApprovalStatus } from '../approval-status/approval-status.entity';

@Entity('approval_requests')
export class ApprovalRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, name: 'module_name' })
  moduleName: string; // e.g. "Tariff", "Billing", "Customer"

  @Column({ type: 'int', name: 'record_id' })
  recordId: number; // The affected record's ID

  @Column({ name: 'requested_by' })
  requestedBy: number;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'requested_by' })
  requester: Admin;

  @Column({ name: 'reviewed_by', nullable: true })
  reviewedBy: number;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: Admin;

  @Column({ name: 'approval_status_id' })
  approvalStatusId: number;

  @ManyToOne(() => ApprovalStatus)
  @JoinColumn({ name: 'approval_status_id' })
  approvalStatus: ApprovalStatus;

  @Column({ type: 'text', nullable: true })
  comments: string; // Approver notes

  @CreateDateColumn({ name: 'requested_at' })
  requestedAt: Date;

  @Column({ type: 'timestamp', name: 'reviewed_at', nullable: true })
  reviewedAt: Date;
}
