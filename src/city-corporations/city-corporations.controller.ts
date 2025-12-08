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
} from '@nestjs/common';
import { CityCorporationsService } from './city-corporations.service';
import { CreateCityCorporationDto } from './dto/create-city-corporation.dto';
import { UpdateCityCorporationDto } from './dto/update-city-corporation.dto';
import { CityCorporation } from './city-corporation.entity';

@Controller('city-corporations')
export class CityCorporationsController {
  constructor(
    private readonly cityCorporationsService: CityCorporationsService,
  ) {}

  @Get()
  async findAll(): Promise<CityCorporation[]> {
    return this.cityCorporationsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CityCorporation> {
    return this.cityCorporationsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCityCorporationDto: CreateCityCorporationDto,
  ): Promise<CityCorporation> {
    return this.cityCorporationsService.create(createCityCorporationDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCityCorporationDto: UpdateCityCorporationDto,
  ): Promise<CityCorporation> {
    return this.cityCorporationsService.update(id, updateCityCorporationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cityCorporationsService.remove(id);
  }
}
