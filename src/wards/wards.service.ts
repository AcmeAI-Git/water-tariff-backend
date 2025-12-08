import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ward } from './ward.entity';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';

@Injectable()
export class WardsService {
  constructor(
    @InjectRepository(Ward)
    private readonly wardRepository: Repository<Ward>,
  ) {}

  async findAll(): Promise<Ward[]> {
    return this.wardRepository.find({
      relations: ['zone'],
    });
  }

  async findOne(id: number): Promise<Ward> {
    const ward = await this.wardRepository.findOne({
      where: { id },
      relations: ['zone'],
    });

    if (!ward) {
      throw new NotFoundException(`Ward with ID ${id} not found`);
    }

    return ward;
  }

  async findByZone(zoneId: number): Promise<Ward[]> {
    return this.wardRepository.find({
      where: { zoneId },
      relations: ['zone'],
    });
  }

  async create(createWardDto: CreateWardDto): Promise<Ward> {
    const ward = this.wardRepository.create(createWardDto);
    return this.wardRepository.save(ward);
  }

  async update(id: number, updateWardDto: UpdateWardDto): Promise<Ward> {
    const ward = await this.wardRepository.findOneBy({ id });

    if (!ward) {
      throw new NotFoundException(`Ward with ID ${id} not found`);
    }

    await this.wardRepository.update(id, updateWardDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const ward = await this.wardRepository.findOneBy({ id });

    if (!ward) {
      throw new NotFoundException(`Ward with ID ${id} not found`);
    }

    await this.wardRepository.delete(id);
  }
}
