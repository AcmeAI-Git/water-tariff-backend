import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { Admin } from './admin.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), AuditLogsModule],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
