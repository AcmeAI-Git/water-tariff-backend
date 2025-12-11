import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ConsumptionService } from './consumption.service';
import { CreateConsumptionDto } from './dto/create-consumption.dto';
import { UpdateConsumptionDto } from './dto/update-consumption.dto';
import { ApproveConsumptionDto } from './dto/approve-consumption.dto';
import { Consumption } from './consumption.entity';
import { SuccessResponse } from '../common/interfaces/api-response.interface';

@ApiTags('consumption')
@Controller('consumption')
export class ConsumptionController {
  constructor(private readonly consumptionService: ConsumptionService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all consumption records',
    description: 'Retrieve all consumption records with optional filters',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by user ID',
    type: Number,
  })
  @ApiQuery({
    name: 'billMonth',
    required: false,
    description: 'Filter by billing month (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'approvalStatusId',
    required: false,
    description: 'Filter by approval status ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Consumption records retrieved successfully',
  })
  async findAll(
    @Query('userId') userId?: string,
    @Query('billMonth') billMonth?: string,
    @Query('approvalStatusId') approvalStatusId?: string,
  ) {
    let data: Consumption[];

    if (userId) {
      data = await this.consumptionService.findByUser(parseInt(userId));
    } else if (billMonth) {
      data = await this.consumptionService.findByMonth(billMonth);
    } else if (approvalStatusId) {
      data = await this.consumptionService.findByStatus(
        parseInt(approvalStatusId),
      );
    } else {
      data = await this.consumptionService.findAll();
    }

    return new SuccessResponse(
      HttpStatus.OK,
      'Consumption records retrieved successfully',
      data,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get consumption record by ID',
    description: 'Retrieve a specific consumption record by ID',
  })
  @ApiParam({ name: 'id', description: 'Consumption record ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Consumption record retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Consumption record not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.consumptionService.findOne(id);
    return new SuccessResponse(
      HttpStatus.OK,
      'Consumption record retrieved successfully',
      data,
    );
  }

  @Post()
  @ApiOperation({
    summary: 'Create consumption record',
    description:
      'Create a new monthly consumption record. Consumption is auto-calculated from current and previous readings.',
  })
  @ApiBody({ type: CreateConsumptionDto })
  @ApiResponse({
    status: 201,
    description: 'Consumption record created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or consumption already exists for this month',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createConsumptionDto: CreateConsumptionDto) {
    const data = await this.consumptionService.create(createConsumptionDto);
    return new SuccessResponse(
      HttpStatus.CREATED,
      'Consumption record created successfully',
      data,
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update consumption record',
    description:
      'Update an existing consumption record (only pending records can be updated)',
  })
  @ApiParam({ name: 'id', description: 'Consumption record ID', type: Number })
  @ApiBody({ type: UpdateConsumptionDto })
  @ApiResponse({
    status: 200,
    description: 'Consumption record updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Consumption record not found' })
  @ApiResponse({ status: 400, description: 'Cannot update approved records' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateConsumptionDto: UpdateConsumptionDto,
  ) {
    const data = await this.consumptionService.update(id, updateConsumptionDto);
    return new SuccessResponse(
      HttpStatus.OK,
      'Consumption record updated successfully',
      data,
    );
  }

  @Put(':id/approve')
  @ApiOperation({
    summary: 'Approve consumption record',
    description: 'Approve a pending consumption record for billing',
  })
  @ApiParam({ name: 'id', description: 'Consumption record ID', type: Number })
  @ApiBody({ type: ApproveConsumptionDto })
  @ApiResponse({
    status: 200,
    description: 'Consumption record approved successfully',
  })
  @ApiResponse({ status: 404, description: 'Consumption record not found' })
  @ApiResponse({
    status: 400,
    description: 'Only pending records can be approved',
  })
  @HttpCode(HttpStatus.OK)
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveConsumptionDto: ApproveConsumptionDto,
  ) {
    const data = await this.consumptionService.approve(
      id,
      approveConsumptionDto,
    );
    return new SuccessResponse(
      HttpStatus.OK,
      'Consumption record approved successfully',
      data,
    );
  }

  @Put(':id/reject')
  @ApiOperation({
    summary: 'Reject consumption record',
    description: 'Reject a pending consumption record',
  })
  @ApiParam({ name: 'id', description: 'Consumption record ID', type: Number })
  @ApiBody({ type: ApproveConsumptionDto })
  @ApiResponse({
    status: 200,
    description: 'Consumption record rejected successfully',
  })
  @ApiResponse({ status: 404, description: 'Consumption record not found' })
  @ApiResponse({
    status: 400,
    description: 'Only pending records can be rejected',
  })
  @HttpCode(HttpStatus.OK)
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveConsumptionDto: ApproveConsumptionDto,
  ) {
    const data = await this.consumptionService.reject(
      id,
      approveConsumptionDto,
    );
    return new SuccessResponse(
      HttpStatus.OK,
      'Consumption record rejected successfully',
      data,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete consumption record',
    description:
      'Delete a consumption record (only pending records can be deleted)',
  })
  @ApiParam({ name: 'id', description: 'Consumption record ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Consumption record deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Consumption record not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete approved records' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.consumptionService.remove(id);
    return new SuccessResponse(
      HttpStatus.OK,
      'Consumption record deleted successfully',
    );
  }
}
