import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consumption } from './consumption.entity';
import { ConsumptionService } from './consumption.service';
import { ConsumptionController } from './consumption.controller';
import { ApprovalStatus } from '../approval-status/approval-status.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { TariffRulesModule } from '../tariff-rules/tariff-rules.module';
import { WaterBillsModule } from '../water-bills/water-bills.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consumption, ApprovalStatus]),
    AuditLogsModule,
    TariffRulesModule,
    WaterBillsModule,
  ],
  controllers: [ConsumptionController],
  providers: [ConsumptionService],
  exports: [ConsumptionService],
})
export class ConsumptionModule {}
