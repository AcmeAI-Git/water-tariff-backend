import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  hourseType: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  meterNo: string;

  @IsDateString()
  @IsNotEmpty()
  installDate: Date;

  @IsNumber()
  @IsNotEmpty()
  zoneId: number;

  @IsNumber()
  @IsNotEmpty()
  wardId: number;
}
