import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find({
      relations: ['role'],
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        roleId: true,
        createdAt: true,
        updatedAt: true,
        password: false, // Exclude password from response
      },
    });
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { id },
      relations: ['role'],
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        roleId: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    return admin;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async create(createAdminDto: CreateAdminDto, userId: number): Promise<Admin> {
    // Check if email already exists
    const existingAdmin = await this.findByEmail(createAdminDto.email);
    if (existingAdmin) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const admin = this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
    });

    const savedAdmin = await this.adminRepository.save(admin);

    // Log audit
    // await this.auditLogsService.logChange(
    //   userId,
    //   'Created Admin',
    //   'admins',
    //   savedAdmin.id,
    //   null,
    //   { ...createAdminDto, password: '[REDACTED]' },
    // );

    // Return admin without password
    const { password, ...result } = savedAdmin;
    return result as Admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.adminRepository.findOneBy({ id });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    // Store old data for audit
    const { password: oldPassword, ...oldData } = admin;

    // Check if email is being updated and if it already exists
    if (updateAdminDto.email && updateAdminDto.email !== admin.email) {
      const existingAdmin = await this.findByEmail(updateAdminDto.email);
      if (existingAdmin) {
        throw new ConflictException('Email already exists');
      }
    }

    // Hash password if it's being updated
    if (updateAdminDto.password) {
      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    await this.adminRepository.update(id, updateAdminDto);

    // Log audit
    // await this.auditLogsService.logChange(
    //   id,
    //   'Updated Admin',
    //   'admins',
    //   id,
    //   oldData,
    //   {
    //     ...updateAdminDto,
    //     password: updateAdminDto.password ? '[REDACTED]' : undefined,
    //   },
    // );

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const admin = await this.adminRepository.findOneBy({ id });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    // Store data for audit
    const { password, ...adminData } = admin;

    await this.adminRepository.delete(id);

    // Log audit
    // await this.auditLogsService.logChange(
    //   id,
    //   'Deleted Admin',
    //   'admins',
    //   id,
    //   adminData,
    //   null,
    // );
  }

  async findByRole(roleId: number): Promise<Admin[]> {
    return this.adminRepository.find({
      where: { roleId },
      relations: ['role'],
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        roleId: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });
  }

  async login(
    loginAdminDto: LoginAdminDto,
  ): Promise<{ admin: Omit<Admin, 'password'>; message: string }> {
    const admin = await this.adminRepository.findOne({
      where: { email: loginAdminDto.email },
      relations: ['role'],
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginAdminDto.password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Remove password from response
    const { password, ...adminData } = admin;

    return {
      admin: adminData,
      message: 'Login successful',
    };
  }

  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const admin = await this.adminRepository.findOne({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      admin.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(
      changePasswordDto.newPassword,
      admin.password,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.adminRepository.update(id, { password: hashedPassword });

    return { message: 'Password changed successfully' };
  }
}
