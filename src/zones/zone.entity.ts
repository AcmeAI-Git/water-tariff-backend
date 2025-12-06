import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CityCorporation } from '../city-corporations/city-corporation.entity';
import { Ward } from '../wards/ward.entity';
import { User } from '../users/user.entity';

@Entity('zones')
export class Zone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, name: 'zone_no' })
  zoneNo: string;

  @Column({ name: 'city_corporation_id' })
  cityCorporationId: number;

  @ManyToOne(() => CityCorporation, (cityCorporation) => cityCorporation.zones)
  @JoinColumn({ name: 'city_corporation_id' })
  cityCorporation: CityCorporation;

  @Column({ type: 'varchar', length: 100 })
  name: string; // e.g. "Dhaka North Zone 1"

  @Column({ type: 'varchar', length: 100, name: 'city_name' })
  cityName: string; // e.g. "Dhaka"

  @Column({ type: 'varchar', length: 50, name: 'tariff_category' })
  tariffCategory: string; // e.g. "High", "Medium", "Low"

  @OneToMany(() => Ward, (ward) => ward.zone)
  wards: Ward[];

  @OneToMany(() => User, (user) => user.zone)
  users: User[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
