import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApprovalStatusService } from './approval-status.service';
import { ApprovalStatus } from './approval-status.entity';
import { CreateApprovalStatusDto } from './dto/create-approval-status.dto';

@Controller('approval-status')
export class ApprovalStatusController {
  constructor(private readonly approvalStatusService: ApprovalStatusService) {}

  @Get()
  async findAll(): Promise<ApprovalStatus[]> {
    return this.approvalStatusService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApprovalStatus> {
    return this.approvalStatusService.findOne(id);
  }

  @Post()
  async create(
    @Body() ApprovalStatusDto: CreateApprovalStatusDto,
  ): Promise<ApprovalStatus> {
    return this.approvalStatusService.create(ApprovalStatusDto);
  }
}
