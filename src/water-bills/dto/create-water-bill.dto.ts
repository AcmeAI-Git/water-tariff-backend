import {
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWaterBillDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 1, description: 'Tariff plan ID' })
  @IsNumber()
  @IsNotEmpty()
  tariffPlanId: number;

  @ApiProperty({ example: 1, description: 'Consumption record ID' })
  @IsNumber()
  @IsNotEmpty()
  consumptionId: number;

  @ApiProperty({ example: 1500.5, description: 'Total bill amount' })
  @IsNumber()
  @IsNotEmpty()
  totalBill: number;

  @ApiPropertyOptional({
    description: 'Detailed slab-wise calculation breakdown',
  })
  @IsOptional()
  breakdown?: any;

  @ApiProperty({
    example: '2025-01-01',
    description: 'Billing month (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  billMonth: Date;

  @ApiPropertyOptional({
    example: 'Unpaid',
    description: 'Bill payment status',
  })
  @IsOptional()
  status?: string;
}
