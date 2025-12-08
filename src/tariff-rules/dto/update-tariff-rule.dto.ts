import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class UpdateTariffRuleDto {
  @IsNumber()
  @IsOptional()
  minConsumption?: number;

  @IsNumber()
  @IsOptional()
  maxConsumption?: number;

  @IsNumber()
  @IsOptional()
  baseRate?: number;

  @IsNumber()
  @IsOptional()
  overageRate?: number;

  @IsDateString()
  @IsOptional()
  effectiveFrom?: Date;

  @IsDateString()
  @IsOptional()
  effectiveTo?: Date;
}
