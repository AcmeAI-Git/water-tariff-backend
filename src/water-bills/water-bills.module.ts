import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaterBillsController } from './water-bills.controller';
import { WaterBillsService } from './water-bills.service';
import { WaterBill } from './water-bill.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([WaterBill]), AuditLogsModule],
  controllers: [WaterBillsController],
  providers: [WaterBillsService],
  exports: [WaterBillsService],
})
export class WaterBillsModule {}
