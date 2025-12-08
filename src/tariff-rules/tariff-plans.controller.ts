import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TariffPlansService } from './tariff-plans.service';
import { CreateTariffPlanDto } from './dto/create-tariff-plan.dto';
import { UpdateTariffPlanDto } from './dto/update-tariff-plan.dto';
import { ApproveTariffRuleDto } from './dto/approve-tariff-rule.dto';
import { TariffPlan } from './tariff-plan.entity';

@Controller('tariff-plans')
export class TariffPlansController {
  constructor(private readonly tariffPlansService: TariffPlansService) {}

  @Get()
  async findAll(
    @Query('approvalStatusId') approvalStatusId?: string,
  ): Promise<TariffPlan[]> {
    if (approvalStatusId) {
      return this.tariffPlansService.findByApprovalStatus(
        parseInt(approvalStatusId),
      );
    }
    return this.tariffPlansService.findAll();
  }

  @Get('active')
  async findActive(): Promise<TariffPlan[]> {
    return this.tariffPlansService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TariffPlan> {
    return this.tariffPlansService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTariffPlanDto: CreateTariffPlanDto,
  ): Promise<TariffPlan> {
    return this.tariffPlansService.create(createTariffPlanDto);
  }

  @Post('calculate-bill')
  @HttpCode(HttpStatus.OK)
  async calculateBill(
    @Body() body: { consumption: number; planId?: number },
  ): Promise<{ totalAmount: number; breakdown: any[] }> {
    return this.tariffPlansService.calculateBill(body.consumption, body.planId);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTariffPlanDto: UpdateTariffPlanDto,
  ): Promise<TariffPlan> {
    return this.tariffPlansService.update(id, updateTariffPlanDto);
  }

  @Put(':id/approve')
  @HttpCode(HttpStatus.OK)
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveTariffRuleDto: ApproveTariffRuleDto,
  ): Promise<TariffPlan> {
    return this.tariffPlansService.approve(id, approveTariffRuleDto);
  }

  @Put(':id/reject')
  @HttpCode(HttpStatus.OK)
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveTariffRuleDto: ApproveTariffRuleDto,
  ): Promise<TariffPlan> {
    return this.tariffPlansService.reject(id, approveTariffRuleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tariffPlansService.remove(id);
  }
}
