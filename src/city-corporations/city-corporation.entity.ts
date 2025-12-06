import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Zone } from '../zones/zone.entity';

@Entity('city_corporations')
export class CityCorporation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string; // e.g. "Dhaka North City Corporation"

  @Column({ type: 'varchar', length: 10 })
  code: string; // e.g. "DNCC"

  @Column({ type: 'varchar', length: 100 })
  address: string;

  @OneToMany(() => Zone, (zone) => zone.cityCorporation)
  zones: Zone[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
