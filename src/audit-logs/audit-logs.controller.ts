import {
  Controller,
  Get,
  Post,
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
import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLog } from './audit-log.entity';
import { SuccessResponse } from '../common/interfaces/api-response.interface';

@ApiTags('audit-logs')
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all audit logs',
    description: 'Retrieve all audit logs with optional filters',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by user ID',
    type: Number,
  })
  @ApiQuery({
    name: 'tableName',
    required: false,
    description: 'Filter by table name',
  })
  @ApiResponse({
    status: 200,
    description: 'Audit logs retrieved successfully',
  })
  async findAll(
    @Query('userId') userId?: string,
    @Query('tableName') tableName?: string,
  ) {
    let data: AuditLog[];

    if (userId) {
      data = await this.auditLogsService.findByUser(parseInt(userId));
    } else if (tableName) {
      data = await this.auditLogsService.findByTable(tableName);
    } else {
      data = await this.auditLogsService.findAll();
    }

    return new SuccessResponse(
      HttpStatus.OK,
      'Audit logs retrieved successfully',
      data,
    );
  }

  @Get('record/:tableName/:recordId')
  @ApiOperation({
    summary: 'Get audit logs for specific record',
    description: 'Retrieve all audit logs for a specific record in a table',
  })
  @ApiParam({ name: 'tableName', description: 'Table name' })
  @ApiParam({ name: 'recordId', description: 'Record ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Audit logs retrieved successfully',
  })
  async findByRecord(
    @Param('tableName') tableName: string,
    @Param('recordId', ParseIntPipe) recordId: number,
  ) {
    const data = await this.auditLogsService.findByRecord(tableName, recordId);
    return new SuccessResponse(
      HttpStatus.OK,
      'Audit logs retrieved successfully',
      data,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get audit log by ID',
    description: 'Retrieve a specific audit log by ID',
  })
  @ApiParam({ name: 'id', description: 'Audit log ID', type: Number })
  @ApiResponse({ status: 200, description: 'Audit log retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Audit log not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.auditLogsService.findOne(id);
    return new SuccessResponse(
      HttpStatus.OK,
      'Audit log retrieved successfully',
      data,
    );
  }

  @Post()
  @ApiOperation({
    summary: 'Create audit log',
    description: 'Manually create an audit log entry',
  })
  @ApiBody({ type: CreateAuditLogDto })
  @ApiResponse({ status: 201, description: 'Audit log created successfully' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAuditLogDto: CreateAuditLogDto) {
    const data = await this.auditLogsService.create(createAuditLogDto);
    return new SuccessResponse(
      HttpStatus.CREATED,
      'Audit log created successfully',
      data,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete audit log',
    description: 'Delete a specific audit log',
  })
  @ApiParam({ name: 'id', description: 'Audit log ID', type: Number })
  @ApiResponse({ status: 200, description: 'Audit log deleted successfully' })
  @ApiResponse({ status: 404, description: 'Audit log not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.auditLogsService.remove(id);
    return new SuccessResponse(HttpStatus.OK, 'Audit log deleted successfully');
  }
}
