import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWaterBillDto {
  @ApiPropertyOptional({ example: 'Paid', description: 'Bill payment status' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 1500.5, description: 'Total bill amount' })
  @IsNumber()
  @IsOptional()
  totalBill?: number;

  @ApiPropertyOptional({
    description: 'Detailed slab-wise calculation breakdown',
  })
  @IsOptional()
  breakdown?: any;
}
