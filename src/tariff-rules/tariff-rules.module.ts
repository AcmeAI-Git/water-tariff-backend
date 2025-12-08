import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TariffRulesController } from './tariff-rules.controller';
import { TariffRulesService } from './tariff-rules.service';
import { TariffRule } from './tariff-rules.entity';
import { TariffPlan } from './tariff-plan.entity';
import { TariffSlab } from './tariff-slab.entity';
import { TariffPlansController } from './tariff-plans.controller';
import { TariffPlansService } from './tariff-plans.service';
import { ApprovalStatus } from '../approval-status/approval-status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TariffRule,
      TariffPlan,
      TariffSlab,
      ApprovalStatus,
    ]),
  ],
  controllers: [TariffRulesController, TariffPlansController],
  providers: [TariffRulesService, TariffPlansService],
  exports: [TariffRulesService, TariffPlansService],
})
export class TariffRulesModule {}
