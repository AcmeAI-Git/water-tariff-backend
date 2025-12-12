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
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Admin } from './admin.entity';
import { SuccessResponse } from '../common/interfaces/api-response.interface';

@ApiTags('admins')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all admins or filter by role',
    description: 'Retrieve all admin users, optionally filtered by role ID',
  })
  @ApiQuery({
    name: 'roleId',
    required: false,
    description: 'Filter admins by role ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Admins retrieved successfully' })
  async findAll(@Query('roleId') roleId?: string) {
    const data = roleId
      ? await this.adminsService.findByRole(parseInt(roleId))
      : await this.adminsService.findAll();
    return new SuccessResponse(
      HttpStatus.OK,
      'Admins retrieved successfully',
      data,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get admin by ID',
    description: 'Retrieve a specific admin by their ID',
  })
  @ApiParam({ name: 'id', description: 'Admin ID', type: Number })
  @ApiResponse({ status: 200, description: 'Admin retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.adminsService.findOne(id);
    return new SuccessResponse(
      HttpStatus.OK,
      'Admin retrieved successfully',
      data,
    );
  }

  @Post()
  @ApiOperation({
    summary: 'Create new admin',
    description: 'Create a new admin user with role assignment',
  })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAdminDto: CreateAdminDto) {
    let userId = 1;
    const data = await this.adminsService.create(createAdminDto, userId);
    return new SuccessResponse(
      HttpStatus.CREATED,
      'Admin created successfully',
      data,
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update admin',
    description: "Update an existing admin's information",
  })
  @ApiParam({ name: 'id', description: 'Admin ID', type: Number })
  @ApiBody({ type: UpdateAdminDto })
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    const data = await this.adminsService.update(id, updateAdminDto);
    return new SuccessResponse(
      HttpStatus.OK,
      'Admin updated successfully',
      data,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete admin',
    description: 'Remove an admin from the system',
  })
  @ApiParam({ name: 'id', description: 'Admin ID', type: Number })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.adminsService.remove(id);
    return new SuccessResponse(HttpStatus.OK, 'Admin deleted successfully');
  }

  @Post('login')
  @ApiOperation({
    summary: 'Admin login',
    description: 'Authenticate an admin user with email and password',
  })
  @ApiBody({ type: LoginAdminDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginAdminDto: LoginAdminDto) {
    const result = await this.adminsService.login(loginAdminDto);
    return new SuccessResponse(HttpStatus.OK, result.message, result.admin);
  }

  @Put(':id/change-password')
  @ApiOperation({
    summary: 'Change password',
    description: 'Change the password for an admin account',
  })
  @ApiParam({ name: 'id', description: 'Admin ID', type: Number })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Current password is incorrect' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const result = await this.adminsService.changePassword(
      id,
      changePasswordDto,
    );
    return new SuccessResponse(HttpStatus.OK, result.message);
  }
}
