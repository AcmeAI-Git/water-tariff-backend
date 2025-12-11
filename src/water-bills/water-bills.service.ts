import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaterBill } from './water-bill.entity';
import { CreateWaterBillDto } from './dto/create-water-bill.dto';
import { UpdateWaterBillDto } from './dto/update-water-bill.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class WaterBillsService {
  constructor(
    @InjectRepository(WaterBill)
    private readonly waterBillRepository: Repository<WaterBill>,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAll(): Promise<WaterBill[]> {
    return this.waterBillRepository.find({
      relations: ['user', 'tariffPlan', 'consumption'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<WaterBill[]> {
    return this.waterBillRepository.find({
      where: { userId },
      relations: ['user', 'tariffPlan', 'consumption'],
      order: { billMonth: 'DESC' },
    });
  }

  async findByStatus(status: string): Promise<WaterBill[]> {
    return this.waterBillRepository.find({
      where: { status },
      relations: ['user', 'tariffPlan', 'consumption'],
      order: { billMonth: 'DESC' },
    });
  }

  async findByMonth(billMonth: string): Promise<WaterBill[]> {
    return this.waterBillRepository.find({
      where: { billMonth: new Date(billMonth) },
      relations: ['user', 'tariffPlan', 'consumption'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<WaterBill> {
    const waterBill = await this.waterBillRepository.findOne({
      where: { id },
      relations: ['user', 'tariffPlan', 'consumption'],
    });

    if (!waterBill) {
      throw new NotFoundException(`Water bill with ID ${id} not found`);
    }

    return waterBill;
  }

  async findByConsumption(consumptionId: number): Promise<WaterBill | null> {
    return this.waterBillRepository.findOne({
      where: { consumptionId },
      relations: ['user', 'tariffPlan', 'consumption'],
    });
  }

  async create(
    createWaterBillDto: CreateWaterBillDto,
    userId?: number,
  ): Promise<WaterBill> {
    // Check if bill already exists for this consumption
    const existingBill = await this.waterBillRepository.findOne({
      where: { consumptionId: createWaterBillDto.consumptionId },
    });

    if (existingBill) {
      throw new BadRequestException(
        'Bill already exists for this consumption record',
      );
    }

    const waterBill = this.waterBillRepository.create(createWaterBillDto);
    const savedBill = await this.waterBillRepository.save(waterBill);

    // Log audit
    if (userId) {
      await this.auditLogsService.logChange(
        userId,
        'Created Water Bill',
        'water_bills',
        savedBill.id,
        null,
        createWaterBillDto,
      );
    }

    return this.findOne(savedBill.id);
  }

  async update(
    id: number,
    updateWaterBillDto: UpdateWaterBillDto,
    userId?: number,
  ): Promise<WaterBill> {
    const waterBill = await this.findOne(id);

    // Store old data
    const oldData = { ...waterBill };

    // Update fields
    Object.assign(waterBill, updateWaterBillDto);

    await this.waterBillRepository.save(waterBill);

    // Log audit
    if (userId) {
      await this.auditLogsService.logChange(
        userId,
        'Updated Water Bill',
        'water_bills',
        id,
        oldData,
        updateWaterBillDto,
      );
    }

    return this.findOne(id);
  }

  async markAsPaid(id: number, userId?: number): Promise<WaterBill> {
    const waterBill = await this.findOne(id);

    if (waterBill.status === 'Paid') {
      throw new BadRequestException('Bill is already paid');
    }

    waterBill.status = 'Paid';
    await this.waterBillRepository.save(waterBill);

    // Log audit
    if (userId) {
      await this.auditLogsService.logChange(
        userId,
        'Marked Bill as Paid',
        'water_bills',
        id,
        { status: 'Unpaid' },
        { status: 'Paid' },
      );
    }

    return this.findOne(id);
  }

  async remove(id: number, userId?: number): Promise<void> {
    const waterBill = await this.findOne(id);

    // Store old data for audit
    const oldData = { ...waterBill };

    await this.waterBillRepository.remove(waterBill);

    // Log audit
    if (userId) {
      await this.auditLogsService.logChange(
        userId,
        'Deleted Water Bill',
        'water_bills',
        id,
        oldData,
        null,
      );
    }
  }
}
