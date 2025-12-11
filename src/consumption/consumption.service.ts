import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Consumption } from './consumption.entity';
import { CreateConsumptionDto } from './dto/create-consumption.dto';
import { UpdateConsumptionDto } from './dto/update-consumption.dto';
import { ApproveConsumptionDto } from './dto/approve-consumption.dto';
import { ApprovalStatus } from '../approval-status/approval-status.entity';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class ConsumptionService {
  constructor(
    @InjectRepository(Consumption)
    private readonly consumptionRepository: Repository<Consumption>,
    @InjectRepository(ApprovalStatus)
    private readonly approvalStatusRepository: Repository<ApprovalStatus>,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAll(): Promise<Consumption[]> {
    return this.consumptionRepository.find({
      relations: ['user', 'creator', 'approver', 'approvalStatus'],
      order: { billMonth: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Consumption[]> {
    return this.consumptionRepository.find({
      where: { userId },
      relations: ['user', 'creator', 'approver', 'approvalStatus'],
      order: { billMonth: 'DESC' },
    });
  }

  async findByMonth(billMonth: string): Promise<Consumption[]> {
    return this.consumptionRepository.find({
      where: { billMonth: new Date(billMonth) },
      relations: ['user', 'creator', 'approver', 'approvalStatus'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(approvalStatusId: number): Promise<Consumption[]> {
    return this.consumptionRepository.find({
      where: { approvalStatusId },
      relations: ['user', 'creator', 'approver', 'approvalStatus'],
      order: { billMonth: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Consumption> {
    const consumption = await this.consumptionRepository.findOne({
      where: { id },
      relations: ['user', 'creator', 'approver', 'approvalStatus'],
    });

    if (!consumption) {
      throw new NotFoundException(`Consumption record with ID ${id} not found`);
    }

    return consumption;
  }

  async create(
    createConsumptionDto: CreateConsumptionDto,
  ): Promise<Consumption> {
    // Check if consumption already exists for this user and month
    const existingConsumption = await this.consumptionRepository.findOne({
      where: {
        userId: createConsumptionDto.userId,
        billMonth: createConsumptionDto.billMonth,
      },
    });

    if (existingConsumption) {
      throw new BadRequestException(
        `Consumption record already exists for this user and month`,
      );
    }

    // Get previous reading if not provided
    let previousReading = createConsumptionDto.previousReading;
    if (!previousReading) {
      const lastConsumption = await this.consumptionRepository.findOne({
        where: {
          userId: createConsumptionDto.userId,
          billMonth: LessThan(createConsumptionDto.billMonth),
        },
        order: { billMonth: 'DESC' },
      });

      previousReading = lastConsumption?.currentReading || 0;
    }

    // Get pending status
    const pendingStatus = await this.approvalStatusRepository.findOne({
      where: { statusName: 'Pending' },
    });

    if (!pendingStatus) {
      throw new BadRequestException('Pending approval status not found');
    }

    const consumption = this.consumptionRepository.create({
      ...createConsumptionDto,
      previousReading,
      approvalStatusId: pendingStatus.id,
      consumption:
        Number(createConsumptionDto.currentReading) - Number(previousReading),
    });

    const savedConsumption = await this.consumptionRepository.save(consumption);

    // Log audit
    await this.auditLogsService.logChange(
      createConsumptionDto.createdBy,
      'Created Consumption Record',
      'consumption',
      savedConsumption.id,
      null,
      {
        userId: createConsumptionDto.userId,
        billMonth: createConsumptionDto.billMonth,
        currentReading: createConsumptionDto.currentReading,
        previousReading,
        consumption: savedConsumption.consumption,
      },
    );

    return this.findOne(savedConsumption.id);
  }

  async update(
    id: number,
    updateConsumptionDto: UpdateConsumptionDto,
  ): Promise<Consumption> {
    const consumption = await this.consumptionRepository.findOne({
      where: { id },
    });

    if (!consumption) {
      throw new NotFoundException(`Consumption record with ID ${id} not found`);
    }

    if (
      consumption.approvalStatus &&
      consumption.approvalStatus.statusName === 'Approved'
    ) {
      throw new BadRequestException(
        'Cannot update approved consumption records',
      );
    }

    // Store old data
    const oldData = { ...consumption };

    // Update fields
    Object.assign(consumption, updateConsumptionDto);

    // Recalculate consumption if readings changed
    if (
      updateConsumptionDto.currentReading ||
      updateConsumptionDto.previousReading
    ) {
      consumption.consumption =
        Number(consumption.currentReading) -
        Number(consumption.previousReading);
    }

    await this.consumptionRepository.save(consumption);

    // Log audit
    await this.auditLogsService.logChange(
      consumption.createdBy,
      'Updated Consumption Record',
      'consumption',
      id,
      oldData,
      updateConsumptionDto,
    );

    return this.findOne(id);
  }

  async approve(
    id: number,
    approveConsumptionDto: ApproveConsumptionDto,
  ): Promise<Consumption> {
    const consumption = await this.consumptionRepository.findOne({
      where: { id },
      relations: ['approvalStatus'],
    });

    if (!consumption) {
      throw new NotFoundException(`Consumption record with ID ${id} not found`);
    }

    if (consumption.approvalStatus.statusName !== 'Pending') {
      throw new BadRequestException(
        'Only pending consumption records can be approved',
      );
    }

    const approvedStatus = await this.approvalStatusRepository.findOne({
      where: { statusName: 'Approved' },
    });

    if (!approvedStatus) {
      throw new BadRequestException('Approved status not found');
    }

    consumption.approvedBy = approveConsumptionDto.approvedBy;
    consumption.approvalStatusId = approvedStatus.id;

    await this.consumptionRepository.save(consumption);

    // Log audit
    await this.auditLogsService.logChange(
      approveConsumptionDto.approvedBy,
      'Approved Consumption Record',
      'consumption',
      id,
      { status: 'Pending' },
      { status: 'Approved', approvedBy: approveConsumptionDto.approvedBy },
    );

    return this.findOne(id);
  }

  async reject(
    id: number,
    approveConsumptionDto: ApproveConsumptionDto,
  ): Promise<Consumption> {
    const consumption = await this.consumptionRepository.findOne({
      where: { id },
      relations: ['approvalStatus'],
    });

    if (!consumption) {
      throw new NotFoundException(`Consumption record with ID ${id} not found`);
    }

    if (consumption.approvalStatus.statusName !== 'Pending') {
      throw new BadRequestException(
        'Only pending consumption records can be rejected',
      );
    }

    const rejectedStatus = await this.approvalStatusRepository.findOne({
      where: { statusName: 'Rejected' },
    });

    if (!rejectedStatus) {
      throw new BadRequestException('Rejected status not found');
    }

    consumption.approvedBy = approveConsumptionDto.approvedBy;
    consumption.approvalStatusId = rejectedStatus.id;

    await this.consumptionRepository.save(consumption);

    // Log audit
    await this.auditLogsService.logChange(
      approveConsumptionDto.approvedBy,
      'Rejected Consumption Record',
      'consumption',
      id,
      { status: 'Pending' },
      { status: 'Rejected', rejectedBy: approveConsumptionDto.approvedBy },
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const consumption = await this.consumptionRepository.findOne({
      where: { id },
    });

    if (!consumption) {
      throw new NotFoundException(`Consumption record with ID ${id} not found`);
    }

    if (
      consumption.approvalStatus &&
      consumption.approvalStatus.statusName === 'Approved'
    ) {
      throw new BadRequestException(
        'Cannot delete approved consumption records',
      );
    }

    // Store data for audit
    const consumptionData = { ...consumption };

    await this.consumptionRepository.delete(id);

    // Log audit
    await this.auditLogsService.logChange(
      consumption.createdBy,
      'Deleted Consumption Record',
      'consumption',
      id,
      consumptionData,
      null,
    );
  }
}
