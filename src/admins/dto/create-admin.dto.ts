import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the admin' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: '+8801712345678',
    description: 'Phone number of the admin',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email address of the admin',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password (minimum 6 characters)',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the role to assign to this admin',
  })
  @IsNumber()
  @IsNotEmpty()
  roleId: number;
}
