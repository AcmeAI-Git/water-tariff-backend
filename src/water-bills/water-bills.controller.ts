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
import { WaterBillsService } from './water-bills.service';
import { CreateWaterBillDto } from './dto/create-water-bill.dto';
import { UpdateWaterBillDto } from './dto/update-water-bill.dto';
import { WaterBill } from './water-bill.entity';
import { SuccessResponse } from '../common/interfaces/api-response.interface';

@ApiTags('water-bills')
@Controller('water-bills')
export class WaterBillsController {
  constructor(private readonly waterBillsService: WaterBillsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all water bills',
    description: 'Retrieve all water bills with optional filters',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by user ID',
    type: Number,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by bill status (Unpaid, Paid, Overdue)',
  })
  @ApiQuery({
    name: 'billMonth',
    required: false,
    description: 'Filter by billing month (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Water bills retrieved successfully',
  })
  async findAll(
    @Query('userId') userId?: string,
    @Query('status') status?: string,
    @Query('billMonth') billMonth?: string,
  ) {
    let data: WaterBill[];

    if (userId) {
      data = await this.waterBillsService.findByUser(parseInt(userId));
    } else if (status) {
      data = await this.waterBillsService.findByStatus(status);
    } else if (billMonth) {
      data = await this.waterBillsService.findByMonth(billMonth);
    } else {
      data = await this.waterBillsService.findAll();
    }

    return new SuccessResponse(
      HttpStatus.OK,
      'Water bills retrieved successfully',
      data,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get water bill by ID',
    description: 'Retrieve a specific water bill by ID',
  })
  @ApiParam({ name: 'id', description: 'Water bill ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Water bill retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Water bill not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.waterBillsService.findOne(id);
    return new SuccessResponse(
      HttpStatus.OK,
      'Water bill retrieved successfully',
      data,
    );
  }

  @Post()
  @ApiOperation({
    summary: 'Create water bill',
    description: 'Create a new water bill manually',
  })
  @ApiBody({ type: CreateWaterBillDto })
  @ApiResponse({
    status: 201,
    description: 'Water bill created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createWaterBillDto: CreateWaterBillDto) {
    const data = await this.waterBillsService.create(createWaterBillDto);
    return new SuccessResponse(
      HttpStatus.CREATED,
      'Water bill created successfully',
      data,
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update water bill',
    description: 'Update an existing water bill',
  })
  @ApiParam({ name: 'id', description: 'Water bill ID', type: Number })
  @ApiBody({ type: UpdateWaterBillDto })
  @ApiResponse({
    status: 200,
    description: 'Water bill updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Water bill not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWaterBillDto: UpdateWaterBillDto,
  ) {
    const data = await this.waterBillsService.update(id, updateWaterBillDto);
    return new SuccessResponse(
      HttpStatus.OK,
      'Water bill updated successfully',
      data,
    );
  }

  @Put(':id/mark-paid')
  @ApiOperation({
    summary: 'Mark bill as paid',
    description: 'Mark a water bill as paid',
  })
  @ApiParam({ name: 'id', description: 'Water bill ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Bill marked as paid successfully',
  })
  @ApiResponse({ status: 404, description: 'Water bill not found' })
  @ApiResponse({ status: 400, description: 'Bill is already paid' })
  async markAsPaid(@Param('id', ParseIntPipe) id: number) {
    const data = await this.waterBillsService.markAsPaid(id);
    return new SuccessResponse(
      HttpStatus.OK,
      'Bill marked as paid successfully',
      data,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete water bill',
    description: 'Delete a water bill record',
  })
  @ApiParam({ name: 'id', description: 'Water bill ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Water bill deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Water bill not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.waterBillsService.remove(id);
    return new SuccessResponse(
      HttpStatus.OK,
      'Water bill deleted successfully',
      null,
    );
  }
}
