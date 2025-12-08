import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Jane Smith',
    description: 'Full name of the user',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({
    example: '+8801987654321',
    description: 'Phone number of the user',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address (must be unique)',
    maxLength: 100,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    example: '123 Main Street, Dhaka',
    description: 'Full address of the user',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 'Residential',
    description: 'Type of house/building',
  })
  @IsString()
  @IsNotEmpty()
  hourseType: string;

  @ApiProperty({
    example: 'MTR001234',
    description: 'Meter number (must be unique)',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  meterNo: string;

  @ApiProperty({
    example: '2025-01-15',
    description: 'Date when the meter was installed',
  })
  @IsDateString()
  @IsNotEmpty()
  installDate: Date;

  @ApiProperty({
    example: 1,
    description: 'ID of the zone where the user is located',
  })
  @IsNumber()
  @IsNotEmpty()
  zoneId: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the ward where the user is located',
  })
  @IsNumber()
  @IsNotEmpty()
  wardId: number;
}
