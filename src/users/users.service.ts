import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['zone', 'ward'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['zone', 'ward'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async findByMeterNo(meterNo: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { meterNo },
    });
  }

  async findByZone(zoneId: number): Promise<User[]> {
    return this.usersRepository.find({
      where: { zoneId },
      relations: ['zone', 'ward'],
    });
  }

  async findByWard(wardId: number): Promise<User[]> {
    return this.usersRepository.find({
      where: { wardId },
      relations: ['zone', 'ward'],
    });
  }

  async findByStatus(status: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { status },
      relations: ['zone', 'ward'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUserByEmail = await this.findByEmail(createUserDto.email);
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if meter number already exists
    const existingUserByMeter = await this.findByMeterNo(createUserDto.meterNo);
    if (existingUserByMeter) {
      throw new ConflictException('Meter number already exists');
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      status: 'pending',
    });
    const savedUser = await this.usersRepository.save(user);

    // Log audit
    await this.auditLogsService.logChange(
      savedUser.id,
      'Created User',
      'users',
      savedUser.id,
      null,
      createUserDto,
    );

    return savedUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Store old data
    const oldData = { ...user };

    // Check if email is being updated and if it already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    // Check if meter number is being updated and if it already exists
    if (updateUserDto.meterNo && updateUserDto.meterNo !== user.meterNo) {
      const existingUser = await this.findByMeterNo(updateUserDto.meterNo);
      if (existingUser) {
        throw new ConflictException('Meter number already exists');
      }
    }

    await this.usersRepository.update(id, updateUserDto);

    // Log audit
    await this.auditLogsService.logChange(
      id,
      'Updated User',
      'users',
      id,
      oldData,
      updateUserDto,
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Store data for audit
    const userData = { ...user };

    await this.usersRepository.delete(id);

    // Log audit
    await this.auditLogsService.logChange(
      id,
      'Deleted User',
      'users',
      id,
      userData,
      null,
    );
  }

  async updateStatus(id: number, status: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const oldStatus = user.status;

    await this.usersRepository.update(id, { status });

    // Log audit
    await this.auditLogsService.logChange(
      id,
      `Updated User Status: ${oldStatus} → ${status}`,
      'users',
      id,
      { status: oldStatus },
      { status },
    );

    return this.findOne(id);
  }
}
