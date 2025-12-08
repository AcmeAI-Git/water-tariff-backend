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
import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { Zone } from './zone.entity';

@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Get()
  async findAll(
    @Query('cityCorporationId') cityCorporationId?: string,
    @Query('tariffCategory') tariffCategory?: string,
  ): Promise<Zone[]> {
    if (cityCorporationId) {
      return this.zonesService.findByCityCorporation(
        parseInt(cityCorporationId),
      );
    }
    if (tariffCategory) {
      return this.zonesService.findByTariffCategory(tariffCategory);
    }
    return this.zonesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Zone> {
    return this.zonesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createZoneDto: CreateZoneDto): Promise<Zone> {
    return this.zonesService.create(createZoneDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateZoneDto: UpdateZoneDto,
  ): Promise<Zone> {
    return this.zonesService.update(id, updateZoneDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.zonesService.remove(id);
  }
}
