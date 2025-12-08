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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TariffSlabDto {
  @ApiProperty({ example: 0, description: 'Minimum consumption in units (first slab must start at 0)' })
  @IsNumber()
  @IsNotEmpty()
  minConsumption: number;

  @ApiPropertyOptional({ example: 100, description: 'Maximum consumption in units (null for unlimited)', nullable: true })
  @IsNumber()
  @IsOptional()
  maxConsumption?: number; // NULL means unlimited

  @ApiProperty({ example: 10, description: 'Rate per unit for this slab' })
  @IsNumber()
  @IsNotEmpty()
  ratePerUnit: number;

  @ApiProperty({ example: 1, description: 'Order of this slab (must be sequential)' })
  @IsNumber()
  @IsNotEmpty()
  slabOrder: number;
}

export class CreateTariffPlanDto {
  @ApiProperty({ example: 'Residential Tariff 2025', description: 'Name of the tariff plan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Standard residential water tariff', description: 'Description of the tariff plan' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1, description: 'ID of the admin creating this tariff plan' })
  @IsNumber()
  @IsNotEmpty()
  createdBy: number;

  @ApiProperty({ example: '2025-01-01', description: 'Date when this tariff plan becomes effective' })
  @IsDateString()
  @IsNotEmpty()
  effectiveFrom: Date;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Date when this tariff plan expires', nullable: true })
  @IsDateString()
  @IsOptional()
  effectiveTo?: Date;

  @ApiProperty({ 
    type: [TariffSlabDto], 
    description: 'Array of tariff slabs defining consumption ranges and rates',
    example: [
      { minConsumption: 0, maxConsumption: 100, ratePerUnit: 10, slabOrder: 1 },
      { minConsumption: 100, maxConsumption: 200, ratePerUnit: 15, slabOrder: 2 },
      { minConsumption: 200, maxConsumption: null, ratePerUnit: 20, slabOrder: 3 }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TariffSlabDto)
  slabs: TariffSlabDto[];
}
