import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';

export class UpdateWardDto {
  @IsNumber()
  @IsOptional()
  zoneId?: number;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  wardNo?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsNumber()
  @IsOptional()
  tariffMultiplier?: number;
}
