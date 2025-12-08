import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNumber()
  @IsNotEmpty()
  roleId: number;
}
