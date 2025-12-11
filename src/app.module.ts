import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { get } from 'http';
import { getDatabaseConfig } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { AdminsModule } from './admins/admins.module';
import { CityCorporationsModule } from './city-corporations/city-corporations.module';
import { ZonesModule } from './zones/zones.module';
import { WardsModule } from './wards/wards.module';
import { TariffRulesModule } from './tariff-rules/tariff-rules.module';
import { ApprovalStatusModule } from './approval-status/approval-status.module';
import { ApprovalRequestsModule } from './approval-requests/approval-requests.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    UsersModule,
    RolesModule,
    AdminsModule,
    CityCorporationsModule,
    ZonesModule,
    WardsModule,
    TariffRulesModule,
    ApprovalStatusModule,
    ApprovalRequestsModule,
    AuditLogsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
