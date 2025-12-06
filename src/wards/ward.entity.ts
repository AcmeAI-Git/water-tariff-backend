import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Zone } from '../zones/zone.entity';
import { User } from '../users/user.entity';

@Entity('wards')
export class Ward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'zone_id' })
  zoneId: number;

  @ManyToOne(() => Zone, (zone) => zone.wards)
  @JoinColumn({ name: 'zone_id' })
  zone: Zone;

  @Column({ type: 'varchar', length: 20, name: 'ward_no' })
  wardNo: string;

  @Column({ type: 'varchar', length: 100 })
  name: string; // e.g. "Banani Ward 20"

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    name: 'tariff_multiplier',
  })
  tariffMultiplier: number; // e.g. 1.2 for rich area, 0.8 for poor area

  @OneToMany(() => User, (user) => user.ward)
  users: User[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
