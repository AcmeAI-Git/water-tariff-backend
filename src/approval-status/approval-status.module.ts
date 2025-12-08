import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalStatus } from './approval-status.entity';
import { ApprovalStatusService } from './approval-status.service';
import { ApprovalStatusController } from './approval-status.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ApprovalStatus])],
  controllers: [ApprovalStatusController],
  providers: [ApprovalStatusService],
  exports: [ApprovalStatusService],
})
export class ApprovalStatusModule {}
