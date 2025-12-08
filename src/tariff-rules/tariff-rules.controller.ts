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
import { TariffRulesService } from './tariff-rules.service';
import { CreateTariffRuleDto } from './dto/create-tariff-rule.dto';
import { UpdateTariffRuleDto } from './dto/update-tariff-rule.dto';
import { ApproveTariffRuleDto } from './dto/approve-tariff-rule.dto';
import { TariffRule } from './tariff-rules.entity';

@Controller('tariff-rules')
export class TariffRulesController {
  constructor(private readonly tariffRulesService: TariffRulesService) {}

  @Get()
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
  async findActive(): Promise<TariffRule[]> {
    return this.tariffRulesService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TariffRule> {
    return this.tariffRulesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTariffRuleDto: CreateTariffRuleDto,
  ): Promise<TariffRule> {
    return this.tariffRulesService.create(createTariffRuleDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTariffRuleDto: UpdateTariffRuleDto,
  ): Promise<TariffRule> {
    return this.tariffRulesService.update(id, updateTariffRuleDto);
  }

  @Put(':id/approve')
  @HttpCode(HttpStatus.OK)
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveTariffRuleDto: ApproveTariffRuleDto,
  ): Promise<TariffRule> {
    return this.tariffRulesService.approve(id, approveTariffRuleDto);
  }

  @Put(':id/reject')
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
