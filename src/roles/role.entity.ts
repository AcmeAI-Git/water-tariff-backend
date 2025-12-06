import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Admin } from '../admins/admin.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string; // 'Customer Admin', 'Billing Admin', 'Tariff Admin', 'Approver', 'Super Admin', 'Meter Reader'

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Admin, (admin) => admin.role)
  admins: Admin[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
