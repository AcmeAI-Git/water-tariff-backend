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
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Admin } from './admin.entity';
import { SuccessResponse } from '../common/interfaces/api-response.interface';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.adminsService.findOne(id);
    return new SuccessResponse(
      HttpStatus.OK,
      'Admin retrieved successfully',
      data,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAdminDto: CreateAdminDto) {
    const data = await this.adminsService.create(createAdminDto);
    return new SuccessResponse(
      HttpStatus.CREATED,
      'Admin created successfully',
      data,
    );
  }

  @Put(':id')
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
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.adminsService.remove(id);
    return new SuccessResponse(HttpStatus.OK, 'Admin deleted successfully');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginAdminDto: LoginAdminDto) {
    const result = await this.adminsService.login(loginAdminDto);
    return new SuccessResponse(HttpStatus.OK, result.message, result.admin);
  }

  @Put(':id/change-password')
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
