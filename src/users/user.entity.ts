import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Zone } from '../zones/zone.entity';
import { Ward } from '../wards/ward.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, name: 'full_name' })
  fullName: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'text', name: 'hourse_type' })
  hourseType: string; // E.g.: Tin Shed, multi-stored

  @Column({ type: 'varchar', length: 50, name: 'meter_no' })
  meterNo: string; // Unique for each household

  @Column({ type: 'date', name: 'install_date' })
  installDate: Date; // Meter installation date

  @Column({ name: 'zone_id' })
  zoneId: number;

  @ManyToOne(() => Zone, (zone) => zone.users)
  @JoinColumn({ name: 'zone_id' })
  zone: Zone;

  @Column({ name: 'ward_id' })
  wardId: number;

  @ManyToOne(() => Ward, (ward) => ward.users)
  @JoinColumn({ name: 'ward_id' })
  ward: Ward;

  @Column({ type: 'varchar', length: 20 })
  status: string; // Active, inactive

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
