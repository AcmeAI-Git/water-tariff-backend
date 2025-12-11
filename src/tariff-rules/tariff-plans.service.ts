import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TariffPlan } from './tariff-plan.entity';
import { TariffSlab } from './tariff-slab.entity';
import { CreateTariffPlanDto } from './dto/create-tariff-plan.dto';
import { UpdateTariffPlanDto } from './dto/update-tariff-plan.dto';
import { ApproveTariffRuleDto } from './dto/approve-tariff-rule.dto';
import { ApprovalStatus } from '../approval-status/approval-status.entity';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class TariffPlansService {
  constructor(
    @InjectRepository(TariffPlan)
    private readonly tariffPlanRepository: Repository<TariffPlan>,
    @InjectRepository(TariffSlab)
    private readonly tariffSlabRepository: Repository<TariffSlab>,
    @InjectRepository(ApprovalStatus)
    private readonly approvalStatusRepository: Repository<ApprovalStatus>,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAll(): Promise<TariffPlan[]> {
    return this.tariffPlanRepository.find({
      relations: ['creator', 'approver', 'approvalStatus', 'slabs'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<TariffPlan> {
    const tariffPlan = await this.tariffPlanRepository.findOne({
      where: { id },
      relations: ['creator', 'approver', 'approvalStatus', 'slabs'],
    });

    if (!tariffPlan) {
      throw new NotFoundException(`Tariff Plan with ID ${id} not found`);
    }

    // Sort slabs by order
    if (tariffPlan.slabs) {
      tariffPlan.slabs.sort((a, b) => a.slabOrder - b.slabOrder);
    }

    return tariffPlan;
  }

  async findByApprovalStatus(statusId: number): Promise<TariffPlan[]> {
    return this.tariffPlanRepository.find({
      where: { approvalStatusId: statusId },
      relations: ['creator', 'approver', 'approvalStatus', 'slabs'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActive(): Promise<TariffPlan[]> {
    const now = new Date();
    const plans = await this.tariffPlanRepository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.approvalStatus', 'approvalStatus')
      .leftJoinAndSelect('plan.slabs', 'slabs')
      .where('plan.effective_from <= :now', { now })
      .andWhere('(plan.effective_to IS NULL OR plan.effective_to >= :now)', {
        now,
      })
      .andWhere('approvalStatus.status_name = :status', { status: 'Approved' })
      .orderBy('slabs.slab_order', 'ASC')
      .getMany();

    return plans;
  }

  async create(createTariffPlanDto: CreateTariffPlanDto): Promise<TariffPlan> {
    // Get "Pending" status
    const pendingStatus = await this.approvalStatusRepository.findOne({
      where: { statusName: 'Pending' },
    });

    if (!pendingStatus) {
      throw new BadRequestException(
        'Pending approval status not found in system',
      );
    }

    // Validate slabs
    this.validateSlabs(createTariffPlanDto.slabs);

    const tariffPlan = this.tariffPlanRepository.create({
      name: createTariffPlanDto.name,
      description: createTariffPlanDto.description,
      createdBy: createTariffPlanDto.createdBy,
      effectiveFrom: createTariffPlanDto.effectiveFrom,
      effectiveTo: createTariffPlanDto.effectiveTo,
      approvalStatusId: pendingStatus.id,
      slabs: createTariffPlanDto.slabs.map((slab) =>
        this.tariffSlabRepository.create(slab),
      ),
    });

    return this.tariffPlanRepository.save(tariffPlan);
  }

  async update(
    id: number,
    updateTariffPlanDto: UpdateTariffPlanDto,
  ): Promise<TariffPlan> {
    const tariffPlan = await this.tariffPlanRepository.findOne({
      where: { id },
      relations: ['slabs'],
    });

    if (!tariffPlan) {
      throw new NotFoundException(`Tariff Plan with ID ${id} not found`);
    }

    // Update plan details
    if (updateTariffPlanDto.name) tariffPlan.name = updateTariffPlanDto.name;
    if (updateTariffPlanDto.description !== undefined)
      tariffPlan.description = updateTariffPlanDto.description;
    if (updateTariffPlanDto.effectiveFrom)
      tariffPlan.effectiveFrom = updateTariffPlanDto.effectiveFrom;
    if (updateTariffPlanDto.effectiveTo !== undefined)
      tariffPlan.effectiveTo = updateTariffPlanDto.effectiveTo;

    // Update slabs if provided
    if (updateTariffPlanDto.slabs) {
      this.validateSlabs(updateTariffPlanDto.slabs);

      // Remove old slabs
      await this.tariffSlabRepository.delete({ tariffPlanId: id });

      // Add new slabs
      tariffPlan.slabs = updateTariffPlanDto.slabs.map((slab) =>
        this.tariffSlabRepository.create({
          ...slab,
          tariffPlanId: id,
        }),
      );
    }

    await this.tariffPlanRepository.save(tariffPlan);
    return this.findOne(id);
  }

  async approve(
    id: number,
    approveTariffRuleDto: ApproveTariffRuleDto,
  ): Promise<TariffPlan> {
    const tariffPlan = await this.tariffPlanRepository.findOne({
      where: { id },
      relations: ['approvalStatus'],
    });

    if (!tariffPlan) {
      throw new NotFoundException(`Tariff Plan with ID ${id} not found`);
    }

    if (tariffPlan.approvalStatus.statusName !== 'Pending') {
      throw new BadRequestException(
        'Only pending tariff plans can be approved',
      );
    }

    const approvedStatus = await this.approvalStatusRepository.findOne({
      where: { statusName: 'Approved' },
    });

    if (!approvedStatus) {
      throw new BadRequestException('Approved status not found in system');
    }

    await this.tariffPlanRepository.update(id, {
      approvalStatusId: approvedStatus.id,
      approvedBy: approveTariffRuleDto.approvedBy,
    });

    return this.findOne(id);
  }

  async reject(
    id: number,
    approveTariffRuleDto: ApproveTariffRuleDto,
  ): Promise<TariffPlan> {
    const tariffPlan = await this.tariffPlanRepository.findOne({
      where: { id },
      relations: ['approvalStatus'],
    });

    if (!tariffPlan) {
      throw new NotFoundException(`Tariff Plan with ID ${id} not found`);
    }

    if (tariffPlan.approvalStatus.statusName !== 'Pending') {
      throw new BadRequestException(
        'Only pending tariff plans can be rejected',
      );
    }

    const rejectedStatus = await this.approvalStatusRepository.findOne({
      where: { statusName: 'Rejected' },
    });

    if (!rejectedStatus) {
      throw new BadRequestException('Rejected status not found in system');
    }

    await this.tariffPlanRepository.update(id, {
      approvalStatusId: rejectedStatus.id,
      approvedBy: approveTariffRuleDto.approvedBy,
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const tariffPlan = await this.tariffPlanRepository.findOneBy({ id });

    if (!tariffPlan) {
      throw new NotFoundException(`Tariff Plan with ID ${id} not found`);
    }

    await this.tariffPlanRepository.delete(id);
  }

  async calculateBill(
    consumption: number,
    planId?: number,
  ): Promise<{ totalAmount: number; breakdown: any[] }> {
    let plan: TariffPlan;

    if (planId) {
      plan = await this.findOne(planId);
    } else {
      const activePlans = await this.findActive();
      if (activePlans.length === 0) {
        throw new NotFoundException('No active tariff plan found');
      }
      plan = activePlans[0]; // Use the first active plan
    }

    const slabs = [...plan.slabs].sort((a, b) => a.slabOrder - b.slabOrder);
    let remainingConsumption = consumption;
    let totalAmount = 0;
    const breakdown: any[] = [];

    for (const slab of slabs) {
      if (remainingConsumption <= 0) break;

      const slabMin = slab.minConsumption;
      const slabMax = slab.maxConsumption;

      let unitsInThisSlab = 0;

      if (slabMax === null) {
        // Unlimited slab
        unitsInThisSlab = remainingConsumption;
      } else {
        const slabCapacity = slabMax - slabMin;
        unitsInThisSlab = Math.min(remainingConsumption, slabCapacity);
      }

      const slabAmount = unitsInThisSlab * Number(slab.ratePerUnit);
      totalAmount += slabAmount;

      breakdown.push({
        slab: `${slabMin}-${slabMax || 'Unlimited'}`,
        units: unitsInThisSlab,
        rate: Number(slab.ratePerUnit),
        amount: slabAmount,
      });

      remainingConsumption -= unitsInThisSlab;
    }

    return { totalAmount, breakdown };
  }

  private validateSlabs(slabs: any[]): void {
    if (!slabs || slabs.length === 0) {
      throw new BadRequestException('At least one tariff slab is required');
    }

    // Sort by order
    slabs.sort((a, b) => a.slabOrder - b.slabOrder);

    // Validate slab continuity
    for (let i = 0; i < slabs.length; i++) {
      const slab = slabs[i];

      if (slab.slabOrder !== i + 1) {
        throw new BadRequestException(
          'Slab orders must be sequential starting from 1',
        );
      }

      if (slab.minConsumption < 0) {
        throw new BadRequestException('Minimum consumption cannot be negative');
      }

      if (
        slab.maxConsumption !== null &&
        slab.maxConsumption <= slab.minConsumption
      ) {
        throw new BadRequestException(
          'Maximum consumption must be greater than minimum consumption',
        );
      }

      // Check continuity with previous slab
      if (i > 0) {
        const prevSlab = slabs[i - 1];
        if (prevSlab.maxConsumption === null) {
          throw new BadRequestException(
            'Only the last slab can have unlimited maximum consumption',
          );
        }
        if (slab.minConsumption !== prevSlab.maxConsumption) {
          throw new BadRequestException(
            'Slabs must be continuous (next min = previous max)',
          );
        }
      } else {
        // First slab should start from 0
        if (slab.minConsumption !== 0) {
          throw new BadRequestException('First slab must start from 0');
        }
      }
    }
  }
}
