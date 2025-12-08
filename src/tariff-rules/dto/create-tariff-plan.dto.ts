import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TariffSlabDto {
  @IsNumber()
  @IsNotEmpty()
  minConsumption: number;

  @IsNumber()
  @IsOptional()
  maxConsumption?: number; // NULL means unlimited

  @IsNumber()
  @IsNotEmpty()
  ratePerUnit: number;

  @IsNumber()
  @IsNotEmpty()
  slabOrder: number;
}

export class CreateTariffPlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  createdBy: number;

  @IsDateString()
  @IsNotEmpty()
  effectiveFrom: Date;

  @IsDateString()
  @IsOptional()
  effectiveTo?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TariffSlabDto)
  slabs: TariffSlabDto[];
}
