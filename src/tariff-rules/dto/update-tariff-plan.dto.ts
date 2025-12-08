import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TariffSlabDto } from './create-tariff-plan.dto';

export class UpdateTariffPlanDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  effectiveFrom?: Date;

  @IsDateString()
  @IsOptional()
  effectiveTo?: Date;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TariffSlabDto)
  slabs?: TariffSlabDto[];
}
