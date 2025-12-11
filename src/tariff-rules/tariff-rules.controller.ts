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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { TariffRulesService } from './tariff-rules.service';
import { CreateTariffRuleDto } from './dto/create-tariff-rule.dto';
import { UpdateTariffRuleDto } from './dto/update-tariff-rule.dto';
import { ApproveTariffRuleDto } from './dto/approve-tariff-rule.dto';
import { TariffRule } from './tariff-rules.entity';

@ApiTags('tariff-rules')
@Controller('tariff-rules')
export class TariffRulesController {
  constructor(private readonly tariffRulesService: TariffRulesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all tariff rules (Legacy)',
    description:
      'Retrieve all legacy tariff rules, optionally filtered by approval status',
  })
  @ApiQuery({
    name: 'approvalStatusId',
    required: false,
    description: 'Filter by approval status ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Tariff rules retrieved successfully',
  })
  async findAll(
    @Query('approvalStatusId') approvalStatusId?: string,
  ): Promise<TariffRule[]> {
    if (approvalStatusId) {
      return this.tariffRulesService.findByApprovalStatus(
        parseInt(approvalStatusId),
      );
    }
    return this.tariffRulesService.findAll();
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get active tariff rules',
    description: 'Retrieve all currently active legacy tariff rules',
  })
  @ApiResponse({
    status: 200,
    description: 'Active tariff rules retrieved successfully',
  })
  async findActive(): Promise<TariffRule[]> {
    return this.tariffRulesService.findActive();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get tariff rule by ID',
    description: 'Retrieve a specific legacy tariff rule by ID',
  })
  @ApiParam({ name: 'id', description: 'Tariff rule ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Tariff rule retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Tariff rule not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TariffRule> {
    return this.tariffRulesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create tariff rule (Legacy)',
    description: 'Create a new legacy tariff rule with single rate',
  })
  @ApiBody({ type: CreateTariffRuleDto })
  @ApiResponse({ status: 201, description: 'Tariff rule created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTariffRuleDto: CreateTariffRuleDto,
  ): Promise<TariffRule> {
    return this.tariffRulesService.create(createTariffRuleDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update tariff rule',
    description: 'Update an existing legacy tariff rule',
  })
  @ApiParam({ name: 'id', description: 'Tariff rule ID', type: Number })
  @ApiBody({ type: UpdateTariffRuleDto })
  @ApiResponse({ status: 200, description: 'Tariff rule updated successfully' })
  @ApiResponse({ status: 404, description: 'Tariff rule not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTariffRuleDto: UpdateTariffRuleDto,
  ): Promise<TariffRule> {
    return this.tariffRulesService.update(id, updateTariffRuleDto);
  }

  @Put(':id/approve')
  @ApiOperation({
    summary: 'Approve tariff rule',
    description:
      'Approve a pending tariff rule and set approval status to approved',
  })
  @ApiParam({ name: 'id', description: 'Tariff rule ID', type: Number })
  @ApiBody({
    type: ApproveTariffRuleDto,
    description: 'Approval details including approver ID and optional comments',
  })
  @ApiResponse({
    status: 200,
    description: 'Tariff rule approved successfully',
  })
  @ApiResponse({ status: 404, description: 'Tariff rule not found' })
  @HttpCode(HttpStatus.OK)
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveTariffRuleDto: ApproveTariffRuleDto,
  ): Promise<TariffRule> {
    return this.tariffRulesService.approve(id, approveTariffRuleDto);
  }

  @Put(':id/reject')
  @ApiOperation({
    summary: 'Reject tariff rule',
    description:
      'Reject a pending tariff rule and set approval status to rejected',
  })
  @ApiParam({ name: 'id', description: 'Tariff rule ID', type: Number })
  @ApiBody({
    type: ApproveTariffRuleDto,
    description:
      'Rejection details including rejector ID and optional comments',
  })
  @ApiResponse({
    status: 200,
    description: 'Tariff rule rejected successfully',
  })
  @ApiResponse({ status: 404, description: 'Tariff rule not found' })
  @HttpCode(HttpStatus.OK)
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveTariffRuleDto: ApproveTariffRuleDto,
  ): Promise<TariffRule> {
    return this.tariffRulesService.reject(id, approveTariffRuleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tariffRulesService.remove(id);
  }
}
