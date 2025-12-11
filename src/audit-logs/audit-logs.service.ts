import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create(createAuditLogDto);
    return this.auditLogRepository.save(auditLog);
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByTable(tableName: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { tableName },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByRecord(tableName: string, recordId: number): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { tableName, recordId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<AuditLog> {
    const auditLog = await this.auditLogRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!auditLog) {
      throw new NotFoundException(`Audit log with ID ${id} not found`);
    }

    return auditLog;
  }

  async remove(id: number): Promise<void> {
    const result = await this.auditLogRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Audit log with ID ${id} not found`);
    }
  }

  // Helper method to log changes automatically
  async logChange(
    userId: number | undefined,
    action: string,
    tableName: string,
    recordId: number,
    oldData: any,
    newData: any,
    ipAddress?: string,
  ): Promise<AuditLog> {
    return this.create({
      userId,
      action,
      tableName,
      recordId,
      oldData,
      newData,
      ipAddress,
    });
  }
}
