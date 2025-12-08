import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalRequest } from './approval-request.entity';
import { CreateApprovalRequestDto } from './dto/create-approval-request.dto';
import { ReviewApprovalRequestDto } from './dto/review-approval-request.dto';
import { ApprovalStatus } from '../approval-status/approval-status.entity';

@Injectable()
export class ApprovalRequestsService {
  constructor(
    @InjectRepository(ApprovalRequest)
    private readonly approvalRequestRepository: Repository<ApprovalRequest>,
    @InjectRepository(ApprovalStatus)
    private readonly approvalStatusRepository: Repository<ApprovalStatus>,
  ) {}

  async findAll(): Promise<ApprovalRequest[]> {
    return this.approvalRequestRepository.find({
      relations: ['requester', 'reviewer', 'approvalStatus'],
    });
  }

  async findOne(id: number): Promise<ApprovalRequest> {
    const request = await this.approvalRequestRepository.findOne({
      where: { id },
      relations: ['requester', 'reviewer', 'approvalStatus'],
    });

    if (!request) {
      throw new NotFoundException(`Approval Request with ID ${id} not found`);
    }

    return request;
  }

  async findByModule(moduleName: string): Promise<ApprovalRequest[]> {
    return this.approvalRequestRepository.find({
      where: { moduleName },
      relations: ['requester', 'reviewer', 'approvalStatus'],
    });
  }

  async findByStatus(statusId: number): Promise<ApprovalRequest[]> {
    return this.approvalRequestRepository.find({
      where: { approvalStatusId: statusId },
      relations: ['requester', 'reviewer', 'approvalStatus'],
    });
  }

  async findPending(): Promise<ApprovalRequest[]> {
    const pendingStatus = await this.approvalStatusRepository.findOne({
      where: { statusName: 'Pending' },
    });

    if (!pendingStatus) {
      return [];
    }

    return this.findByStatus(pendingStatus.id);
  }

  async create(
    createApprovalRequestDto: CreateApprovalRequestDto,
  ): Promise<ApprovalRequest> {
    const pendingStatus = await this.approvalStatusRepository.findOne({
      where: { statusName: 'Pending' },
    });

    if (!pendingStatus) {
      throw new BadRequestException(
        'Pending approval status not found in system',
      );
    }

    const request = this.approvalRequestRepository.create({
      ...createApprovalRequestDto,
      approvalStatusId: pendingStatus.id,
    });

    return this.approvalRequestRepository.save(request);
  }

  async review(
    id: number,
    reviewApprovalRequestDto: ReviewApprovalRequestDto,
  ): Promise<ApprovalRequest> {
    const request = await this.approvalRequestRepository.findOne({
      where: { id },
      relations: ['approvalStatus'],
    });

    if (!request) {
      throw new NotFoundException(`Approval Request with ID ${id} not found`);
    }

    if (request.approvalStatus.statusName !== 'Pending') {
      throw new BadRequestException('Only pending requests can be reviewed');
    }

    const newStatus = await this.approvalStatusRepository.findOne({
      where: { statusName: reviewApprovalRequestDto.status },
    });

    if (!newStatus) {
      throw new BadRequestException(
        `Status ${reviewApprovalRequestDto.status} not found`,
      );
    }

    await this.approvalRequestRepository.update(id, {
      approvalStatusId: newStatus.id,
      reviewedBy: reviewApprovalRequestDto.reviewedBy,
      comments: reviewApprovalRequestDto.comments,
      reviewedAt: new Date(),
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const request = await this.approvalRequestRepository.findOneBy({ id });

    if (!request) {
      throw new NotFoundException(`Approval Request with ID ${id} not found`);
    }

    await this.approvalRequestRepository.delete(id);
  }
}
