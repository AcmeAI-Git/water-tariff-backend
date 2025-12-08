import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Admin } from '../admins/admin.entity';

@Entity('approval_status')
export class ApprovalStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, name: 'status_name' })
  statusName: string; // 'Pending', 'Approved', 'Rejected'

  @Column({ type: 'text', nullable: true })
  description: string;
}
