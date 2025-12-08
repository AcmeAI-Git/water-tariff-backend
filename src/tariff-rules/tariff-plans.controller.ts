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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { TariffPlansService } from './tariff-plans.service';
import { CreateTariffPlanDto } from './dto/create-tariff-plan.dto';
import { UpdateTariffPlanDto } from './dto/update-tariff-plan.dto';
import { ApproveTariffRuleDto } from './dto/approve-tariff-rule.dto';
import { TariffPlan } from './tariff-plan.entity';

@ApiTags('tariff-plans')
@Controller('tariff-plans')
export class TariffPlansController {
  constructor(private readonly tariffPlansService: TariffPlansService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tariff plans', description: 'Retrieve all tariff plans, optionally filtered by approval status' })
  @ApiQuery({ name: 'approvalStatusId', required: false, description: 'Filter by approval status ID', type: Number })
  @ApiResponse({ status: 200, description: 'Tariff plans retrieved successfully' })
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
  @ApiOperation({ summary: 'Get active tariff plans', description: 'Retrieve all currently active tariff plans' })
  @ApiResponse({ status: 200, description: 'Active tariff plans retrieved successfully' })
  async findActive(): Promise<TariffPlan[]> {
    return this.tariffPlansService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tariff plan by ID', description: 'Retrieve a specific tariff plan with all its slabs' })
  @ApiParam({ name: 'id', description: 'Tariff plan ID', type: Number })
  @ApiResponse({ status: 200, description: 'Tariff plan retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tariff plan not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TariffPlan> {
    return this.tariffPlansService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create tariff plan', description: 'Create a new tariff plan with slab-based pricing structure' })
  @ApiBody({ type: CreateTariffPlanDto })
  @ApiResponse({ status: 201, description: 'Tariff plan created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid slab configuration or validation error' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTariffPlanDto: CreateTariffPlanDto,
  ): Promise<TariffPlan> {
    return this.tariffPlansService.create(createTariffPlanDto);
  }

  @Post('calculate-bill')
  @ApiOperation({ summary: 'Calculate water bill', description: 'Calculate water bill based on consumption using slab-based pricing' })
  @ApiBody({ 
    schema: { 
      type: 'object',
      properties: {
        consumption: { type: 'number', example: 250, description: 'Water consumption in units' },
        planId: { type: 'number', example: 1, description: 'Optional tariff plan ID (uses active plan if not provided)' }
      },
      required: ['consumption']
    }
  })
  @ApiResponse({ status: 200, description: 'Bill calculated successfully' })
  @HttpCode(HttpStatus.OK)
  async calculateBill(
    @Body() body: { consumption: number; planId?: number },
  ): Promise<{ totalAmount: number; breakdown: any[] }> {
    return this.tariffPlansService.calculateBill(body.consumption, body.planId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tariff plan', description: 'Update an existing tariff plan' })
  @ApiParam({ name: 'id', description: 'Tariff plan ID', type: Number })
  @ApiBody({ type: UpdateTariffPlanDto })
  @ApiResponse({ status: 200, description: 'Tariff plan updated successfully' })
  @ApiResponse({ status: 404, description: 'Tariff plan not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTariffPlanDto: UpdateTariffPlanDto,
  ): Promise<TariffPlan> {
    return this.tariffPlansService.update(id, updateTariffPlanDto);
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve tariff plan', description: 'Approve a pending tariff plan' })
  @ApiParam({ name: 'id', description: 'Tariff plan ID', type: Number })
  @ApiBody({ type: ApproveTariffRuleDto })
  @ApiResponse({ status: 200, description: 'Tariff plan approved successfully' })
  @ApiResponse({ status: 404, description: 'Tariff plan not found' })
  @HttpCode(HttpStatus.OK)
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveTariffRuleDto: ApproveTariffRuleDto,
  ): Promise<TariffPlan> {
    return this.tariffPlansService.approve(id, approveTariffRuleDto);
  }

  @Put(':id/reject')
  @ApiOperation({ summary: 'Reject tariff plan', description: 'Reject a pending tariff plan' })
  @ApiParam({ name: 'id', description: 'Tariff plan ID', type: Number })
  @ApiBody({ type: ApproveTariffRuleDto })
  @ApiResponse({ status: 200, description: 'Tariff plan rejected successfully' })
  @ApiResponse({ status: 404, description: 'Tariff plan not found' })
  @HttpCode(HttpStatus.OK)
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveTariffRuleDto: ApproveTariffRuleDto,
  ): Promise<TariffPlan> {
    return this.tariffPlansService.reject(id, approveTariffRuleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tariff plan', description: 'Delete a tariff plan and all its associated slabs' })
  @ApiParam({ name: 'id', description: 'Tariff plan ID', type: Number })
  @ApiResponse({ status: 204, description: 'Tariff plan deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tariff plan not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tariffPlansService.remove(id);
  }
}
