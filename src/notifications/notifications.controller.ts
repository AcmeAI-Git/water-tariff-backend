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
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './notification.entity';
import { SuccessResponse } from '../common/interfaces/api-response.interface';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all notifications',
    description: 'Retrieve all notifications with optional filters',
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
    description: 'Filter by status',
    enum: ['Unread', 'Read'],
  })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
  })
  async findAll(
    @Query('userId') userId?: string,
    @Query('status') status?: string,
  ) {
    let data: Notification[];

    if (userId) {
      data = await this.notificationsService.findByUser(parseInt(userId));
    } else if (status) {
      data = await this.notificationsService.findByStatus(status);
    } else {
      data = await this.notificationsService.findAll();
    }

    return new SuccessResponse(
      HttpStatus.OK,
      'Notifications retrieved successfully',
      data,
    );
  }

  @Get('user/:userId/unread')
  @ApiOperation({
    summary: 'Get unread notifications',
    description: 'Retrieve all unread notifications for a specific user',
  })
  @ApiParam({ name: 'userId', description: 'User ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Unread notifications retrieved successfully',
  })
  async findUnreadByUser(@Param('userId', ParseIntPipe) userId: number) {
    const data = await this.notificationsService.findUnreadByUser(userId);
    return new SuccessResponse(
      HttpStatus.OK,
      'Unread notifications retrieved successfully',
      data,
    );
  }

  @Get('user/:userId/count')
  @ApiOperation({
    summary: 'Get unread count',
    description: 'Get the count of unread notifications for a user',
  })
  @ApiParam({ name: 'userId', description: 'User ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
  })
  async getUnreadCount(@Param('userId', ParseIntPipe) userId: number) {
    const count = await this.notificationsService.getUnreadCount(userId);
    return new SuccessResponse(
      HttpStatus.OK,
      'Unread count retrieved successfully',
      { count },
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get notification by ID',
    description: 'Retrieve a specific notification by ID',
  })
  @ApiParam({ name: 'id', description: 'Notification ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Notification retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.notificationsService.findOne(id);
    return new SuccessResponse(
      HttpStatus.OK,
      'Notification retrieved successfully',
      data,
    );
  }

  @Post()
  @ApiOperation({
    summary: 'Create notification',
    description: 'Create a new notification for a user',
  })
  @ApiBody({ type: CreateNotificationDto })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    const data = await this.notificationsService.create(createNotificationDto);
    return new SuccessResponse(
      HttpStatus.CREATED,
      'Notification created successfully',
      data,
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update notification',
    description: 'Update notification status',
  })
  @ApiParam({ name: 'id', description: 'Notification ID', type: Number })
  @ApiBody({ type: UpdateNotificationDto })
  @ApiResponse({
    status: 200,
    description: 'Notification updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    const data = await this.notificationsService.update(
      id,
      updateNotificationDto,
    );
    return new SuccessResponse(
      HttpStatus.OK,
      'Notification updated successfully',
      data,
    );
  }

  @Put(':id/read')
  @ApiOperation({
    summary: 'Mark as read',
    description: 'Mark a notification as read',
  })
  @ApiParam({ name: 'id', description: 'Notification ID', type: Number })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    const data = await this.notificationsService.markAsRead(id);
    return new SuccessResponse(
      HttpStatus.OK,
      'Notification marked as read',
      data,
    );
  }

  @Put('user/:userId/read-all')
  @ApiOperation({
    summary: 'Mark all as read',
    description: 'Mark all notifications as read for a specific user',
  })
  @ApiParam({ name: 'userId', description: 'User ID', type: Number })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(@Param('userId', ParseIntPipe) userId: number) {
    await this.notificationsService.markAllAsRead(userId);
    return new SuccessResponse(
      HttpStatus.OK,
      'All notifications marked as read',
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete notification',
    description: 'Delete a specific notification',
  })
  @ApiParam({ name: 'id', description: 'Notification ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.notificationsService.remove(id);
    return new SuccessResponse(
      HttpStatus.OK,
      'Notification deleted successfully',
    );
  }
}
