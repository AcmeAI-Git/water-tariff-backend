import { IsString, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class CreateWardDto {
  @IsNumber()
  @IsNotEmpty()
  zoneId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  wardNo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  tariffMultiplier: number;
}
