import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Admin } from '../admins/admin.entity';
import { ApprovalStatus } from '../approval-status/approval-status.entity';
import { TariffSlab } from './tariff-slab.entity';

@Entity('tariff_plans')
export class TariffPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string; // e.g. "Residential Water Tariff 2025"

  @Column({ type: 'text', nullable: true })
  description: string;

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

  @Column({ type: 'date', name: 'effective_from' })
  effectiveFrom: Date;

  @Column({ type: 'date', name: 'effective_to', nullable: true })
  effectiveTo: Date;

  @OneToMany(() => TariffSlab, (slab) => slab.tariffPlan, { cascade: true })
  slabs: TariffSlab[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
