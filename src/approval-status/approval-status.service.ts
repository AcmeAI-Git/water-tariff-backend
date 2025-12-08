import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalStatus } from './approval-status.entity';
import { CreateApprovalStatusDto } from './dto/create-approval-status.dto';

@Injectable()
export class ApprovalStatusService {
  constructor(
    @InjectRepository(ApprovalStatus)
    private readonly approvalStatusRepository: Repository<ApprovalStatus>,
  ) {}

  async findAll(): Promise<ApprovalStatus[]> {
    return this.approvalStatusRepository.find();
  }

  async findOne(id: number): Promise<ApprovalStatus> {
    const status = await this.approvalStatusRepository.findOneBy({ id });
    if (!status) {
      throw new NotFoundException(`Approval Status with ID ${id} not found`);
    }
    return status;
  }

  async findByName(statusName: string): Promise<ApprovalStatus | null> {
    return this.approvalStatusRepository.findOne({ where: { statusName } });
  }

  async create(
    createApprovalStatusDto: CreateApprovalStatusDto,
  ): Promise<ApprovalStatus> {
    const newStatus = this.approvalStatusRepository.create(
      createApprovalStatusDto,
    );
    return this.approvalStatusRepository.save(newStatus);
  }
}
