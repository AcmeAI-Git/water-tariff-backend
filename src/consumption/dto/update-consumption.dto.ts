import { IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateConsumptionDto {
  @ApiPropertyOptional({ example: '2025-12-01', description: 'Billing month' })
  @IsDateString()
  @IsOptional()
  billMonth?: Date;

  @ApiPropertyOptional({ example: 250.5, description: 'Current meter reading' })
  @IsNumber()
  @IsOptional()
  currentReading?: number;

  @ApiPropertyOptional({
    example: 150.0,
    description: 'Previous meter reading',
  })
  @IsNumber()
  @IsOptional()
  previousReading?: number;
}
