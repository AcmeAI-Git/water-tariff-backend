import {
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  fullName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  hourseType?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  meterNo?: string;

  @IsDateString()
  @IsOptional()
  installDate?: Date;

  @IsNumber()
  @IsOptional()
  zoneId?: number;

  @IsNumber()
  @IsOptional()
  wardId?: number;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  status?: string;
}
