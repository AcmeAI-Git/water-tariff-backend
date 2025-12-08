import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalRequestsController } from './approval-requests.controller';
import { ApprovalRequestsService } from './approval-requests.service';
import { ApprovalRequest } from './approval-request.entity';
import { ApprovalStatus } from '../approval-status/approval-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApprovalRequest, ApprovalStatus])],
  controllers: [ApprovalRequestsController],
  providers: [ApprovalRequestsService],
  exports: [ApprovalRequestsService],
})
export class ApprovalRequestsModule {}
