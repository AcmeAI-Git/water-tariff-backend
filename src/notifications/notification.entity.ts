import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  message: string;

  @Column({ length: 50 })
  type: string; // "Bill", "Approval", "Reminder"

  @Column({ length: 20, default: 'Unread' })
  status: string; // "Unread", "Read"

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
