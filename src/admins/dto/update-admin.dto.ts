import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAdminDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Full name of the admin',
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({
    example: '+8801712345678',
    description: 'Phone number of the admin',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: 'admin@example.com',
    description: 'Email address of the admin',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'password123',
    description: 'Password (minimum 6 characters)',
    minLength: 6,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the role to assign to this admin',
  })
  @IsNumber()
  @IsOptional()
  roleId?: number;
}
