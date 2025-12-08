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
import { WardsService } from './wards.service';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { Ward } from './ward.entity';

@Controller('wards')
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  @Get()
  async findAll(@Query('zoneId') zoneId?: string): Promise<Ward[]> {
    if (zoneId) {
      return this.wardsService.findByZone(parseInt(zoneId));
    }
    return this.wardsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Ward> {
    return this.wardsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createWardDto: CreateWardDto): Promise<Ward> {
    return this.wardsService.create(createWardDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWardDto: UpdateWardDto,
  ): Promise<Ward> {
    return this.wardsService.update(id, updateWardDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.wardsService.remove(id);
  }
}
