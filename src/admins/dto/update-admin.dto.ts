import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  MinLength,
} from 'class-validator';

export class UpdateAdminDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsNumber()
  @IsOptional()
  roleId?: number;
}
