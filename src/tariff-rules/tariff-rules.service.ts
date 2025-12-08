import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TariffRule } from './tariff-rules.entity';
import { CreateTariffRuleDto } from './dto/create-tariff-rule.dto';
import { UpdateTariffRuleDto } from './dto/update-tariff-rule.dto';
import { ApproveTariffRuleDto } from './dto/approve-tariff-rule.dto';
import { ApprovalStatus } from '../approval-status/approval-status.entity';

@Injectable()
export class TariffRulesService {
  constructor(
    @InjectRepository(TariffRule)
    private readonly tariffRuleRepository: Repository<TariffRule>,
    @InjectRepository(ApprovalStatus)
    private readonly approvalStatusRepository: Repository<ApprovalStatus>,
  ) {}

  async findAll(): Promise<TariffRule[]> {
    return this.tariffRuleRepository.find({
      relations: ['creator', 'approver', 'approvalStatus'],
    });
  }

  async findOne(id: number): Promise<TariffRule> {
    const tariffRule = await this.tariffRuleRepository.findOne({
      where: { id },
      relations: ['creator', 'approver', 'approvalStatus'],
    });

    if (!tariffRule) {
      throw new NotFoundException(`Tariff Rule with ID ${id} not found`);
    }

    return tariffRule;
  }

  async findByApprovalStatus(statusId: number): Promise<TariffRule[]> {
    return this.tariffRuleRepository.find({
      where: { approvalStatusId: statusId },
      relations: ['creator', 'approver', 'approvalStatus'],
    });
  }

  async findActive(): Promise<TariffRule[]> {
    const now = new Date();
    return this.tariffRuleRepository
      .createQueryBuilder('tariff')
      .leftJoinAndSelect('tariff.approvalStatus', 'approvalStatus')
      .where('tariff.effective_from <= :now', { now })
      .andWhere(
        '(tariff.effective_to IS NULL OR tariff.effective_to >= :now)',
        { now },
      )
      .andWhere('approvalStatus.status_name = :status', { status: 'Approved' })
      .getMany();
  }

  async create(createTariffRuleDto: CreateTariffRuleDto): Promise<TariffRule> {
    // Get "Pending" status
    const pendingStatus = await this.approvalStatusRepository.findOne({
      where: { statusName: 'Pending' },
    });

    if (!pendingStatus) {
      throw new BadRequestException(
        'Pending approval status not found in system',
      );
    }

    const tariffRule = this.tariffRuleRepository.create({
      ...createTariffRuleDto,
      approvalStatusId: pendingStatus.id,
    });

    return this.tariffRuleRepository.save(tariffRule);
  }

  async update(
    id: number,
    updateTariffRuleDto: UpdateTariffRuleDto,
  ): Promise<TariffRule> {
    const tariffRule = await this.tariffRuleRepository.findOneBy({ id });

    if (!tariffRule) {
      throw new NotFoundException(`Tariff Rule with ID ${id} not found`);
    }

    await this.tariffRuleRepository.update(id, updateTariffRuleDto);
    return this.findOne(id);
  }

  async approve(
    id: number,
    approveTariffRuleDto: ApproveTariffRuleDto,
  ): Promise<TariffRule> {
    const tariffRule = await this.tariffRuleRepository.findOne({
      where: { id },
      relations: ['approvalStatus'],
    });

    if (!tariffRule) {
      throw new NotFoundException(`Tariff Rule with ID ${id} not found`);
    }

    if (tariffRule.approvalStatus.statusName !== 'Pending') {
      throw new BadRequestException(
        'Only pending tariff rules can be approved',
      );
    }

    const approvedStatus = await this.approvalStatusRepository.findOne({
      where: { statusName: 'Approved' },
    });

    if (!approvedStatus) {
      throw new BadRequestException('Approved status not found in system');
    }

    await this.tariffRuleRepository.update(id, {
      approvalStatusId: approvedStatus.id,
      approvedBy: approveTariffRuleDto.approvedBy,
    });

    return this.findOne(id);
  }

  async reject(
    id: number,
    approveTariffRuleDto: ApproveTariffRuleDto,
  ): Promise<TariffRule> {
    const tariffRule = await this.tariffRuleRepository.findOne({
      where: { id },
      relations: ['approvalStatus'],
    });

    if (!tariffRule) {
      throw new NotFoundException(`Tariff Rule with ID ${id} not found`);
    }

    if (tariffRule.approvalStatus.statusName !== 'Pending') {
      throw new BadRequestException(
        'Only pending tariff rules can be rejected',
      );
    }

    const rejectedStatus = await this.approvalStatusRepository.findOne({
      where: { statusName: 'Rejected' },
    });

    if (!rejectedStatus) {
      throw new BadRequestException('Rejected status not found in system');
    }

    await this.tariffRuleRepository.update(id, {
      approvalStatusId: rejectedStatus.id,
      approvedBy: approveTariffRuleDto.approvedBy,
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const tariffRule = await this.tariffRuleRepository.findOneBy({ id });

    if (!tariffRule) {
      throw new NotFoundException(`Tariff Rule with ID ${id} not found`);
    }

    await this.tariffRuleRepository.delete(id);
  }
}
