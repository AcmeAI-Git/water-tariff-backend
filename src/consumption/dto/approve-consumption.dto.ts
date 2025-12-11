import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApproveConsumptionDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the admin approving the consumption',
  })
  @IsNumber()
  @IsNotEmpty()
  approvedBy: number;

  @ApiPropertyOptional({
    example: 'Approved for billing',
    description: 'Optional comments',
  })
  @IsString()
  @IsOptional()
  comments?: string;
}
