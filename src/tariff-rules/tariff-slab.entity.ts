import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TariffPlan } from './tariff-plan.entity';

@Entity('tariff_slabs')
export class TariffSlab {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tariff_plan_id' })
  tariffPlanId: number;

  @ManyToOne(() => TariffPlan, (plan) => plan.slabs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tariff_plan_id' })
  tariffPlan: TariffPlan;

  @Column({ type: 'int', name: 'min_consumption' })
  minConsumption: number; // e.g., 0

  @Column({ type: 'int', name: 'max_consumption', nullable: true })
  maxConsumption: number; // e.g., 100, NULL means unlimited

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'rate_per_unit' })
  ratePerUnit: number; // Rate per m³

  @Column({ type: 'int', name: 'slab_order' })
  slabOrder: number; // Order of slab evaluation (1, 2, 3...)
}
