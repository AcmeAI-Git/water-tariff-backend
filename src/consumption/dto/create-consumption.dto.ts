import {
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConsumptionDto {
  @ApiProperty({ example: 1, description: 'ID of the user/customer' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the billing admin creating this record',
  })
  @IsNumber()
  @IsNotEmpty()
  createdBy: number;

  @ApiProperty({
    example: '2025-12-01',
    description: 'Billing month (YYYY-MM-DD format)',
  })
  @IsDateString()
  @IsNotEmpty()
  billMonth: Date;

  @ApiProperty({ example: 250.5, description: 'Current meter reading' })
  @IsNumber()
  @IsNotEmpty()
  currentReading: number;

  @ApiPropertyOptional({
    example: 150.0,
    description:
      'Previous meter reading (will fetch from last month if not provided)',
  })
  @IsNumber()
  @IsOptional()
  previousReading?: number;
}
