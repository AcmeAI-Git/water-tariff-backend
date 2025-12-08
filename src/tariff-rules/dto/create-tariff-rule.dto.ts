import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  IsDecimal,
} from 'class-validator';

export class CreateTariffRuleDto {
  @IsNumber()
  @IsNotEmpty()
  createdBy: number;

  @IsNumber()
  @IsNotEmpty()
  minConsumption: number;

  @IsNumber()
  @IsNotEmpty()
  maxConsumption: number;

  @IsNumber()
  @IsNotEmpty()
  baseRate: number;

  @IsNumber()
  @IsNotEmpty()
  overageRate: number;

  @IsDateString()
  @IsNotEmpty()
  effectiveFrom: Date;

  @IsDateString()
  @IsOptional()
  effectiveTo?: Date;
}
