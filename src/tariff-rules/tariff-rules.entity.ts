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

// Legacy entity - keeping for backward compatibility
// Use TariffPlan and TariffSlab for new implementations
@Entity('tariff_rules')
export class TariffRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'created_by' })
  createdBy: number;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'created_by' })
  creator: Admin;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: number;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'approved_by' })
  approver: Admin;

  @Column({ name: 'approval_status_id' })
  approvalStatusId: number;

  @ManyToOne(() => ApprovalStatus)
  @JoinColumn({ name: 'approval_status_id' })
  approvalStatus: ApprovalStatus;

  @Column({ type: 'int', name: 'min_consumption' })
  minConsumption: number;

  @Column({ type: 'int', name: 'max_consumption' })
  maxConsumption: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'base_rate' })
  baseRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'overage_rate' })
  overageRate: number;

  @Column({ type: 'date', name: 'effective_from' })
  effectiveFrom: Date;

  @Column({ type: 'date', name: 'effective_to', nullable: true })
  effectiveTo: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

export { TariffPlan } from './tariff-plan.entity';
export { TariffSlab } from './tariff-slab.entity';
