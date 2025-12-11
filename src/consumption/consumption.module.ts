import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consumption } from './consumption.entity';
import { ConsumptionService } from './consumption.service';
import { ConsumptionController } from './consumption.controller';
import { ApprovalStatus } from '../approval-status/approval-status.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consumption, ApprovalStatus]),
    AuditLogsModule,
  ],
  controllers: [ConsumptionController],
  providers: [ConsumptionService],
  exports: [ConsumptionService],
})
export class ConsumptionModule {}
