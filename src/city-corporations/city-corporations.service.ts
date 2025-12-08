import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityCorporation } from './city-corporation.entity';
import { CreateCityCorporationDto } from './dto/create-city-corporation.dto';
import { UpdateCityCorporationDto } from './dto/update-city-corporation.dto';

@Injectable()
export class CityCorporationsService {
  constructor(
    @InjectRepository(CityCorporation)
    private readonly cityCorporationRepository: Repository<CityCorporation>,
  ) {}

  async findAll(): Promise<CityCorporation[]> {
    return this.cityCorporationRepository.find({
      relations: ['zones'],
    });
  }

  async findOne(id: number): Promise<CityCorporation> {
    const cityCorporation = await this.cityCorporationRepository.findOne({
      where: { id },
      relations: ['zones'],
    });

    if (!cityCorporation) {
      throw new NotFoundException(`City Corporation with ID ${id} not found`);
    }

    return cityCorporation;
  }

  async findByCode(code: string): Promise<CityCorporation | null> {
    return this.cityCorporationRepository.findOne({
      where: { code },
    });
  }

  async create(
    createCityCorporationDto: CreateCityCorporationDto,
  ): Promise<CityCorporation> {
    const existingCityCorporation = await this.findByCode(
      createCityCorporationDto.code,
    );

    if (existingCityCorporation) {
      throw new ConflictException('City Corporation code already exists');
    }

    const cityCorporation = this.cityCorporationRepository.create(
      createCityCorporationDto,
    );
    return this.cityCorporationRepository.save(cityCorporation);
  }

  async update(
    id: number,
    updateCityCorporationDto: UpdateCityCorporationDto,
  ): Promise<CityCorporation> {
    const cityCorporation = await this.cityCorporationRepository.findOneBy({
      id,
    });

    if (!cityCorporation) {
      throw new NotFoundException(`City Corporation with ID ${id} not found`);
    }

    if (
      updateCityCorporationDto.code &&
      updateCityCorporationDto.code !== cityCorporation.code
    ) {
      const existingCityCorporation = await this.findByCode(
        updateCityCorporationDto.code,
      );
      if (existingCityCorporation) {
        throw new ConflictException('City Corporation code already exists');
      }
    }

    await this.cityCorporationRepository.update(id, updateCityCorporationDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const cityCorporation = await this.cityCorporationRepository.findOneBy({
      id,
    });

    if (!cityCorporation) {
      throw new NotFoundException(`City Corporation with ID ${id} not found`);
    }

    await this.cityCorporationRepository.delete(id);
  }
}
