import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuditLogDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the user performing the action',
  })
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty({
    example: 'Updated Tariff Rule',
    description: 'Description of the action performed',
  })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({
    example: 'tariff_rules',
    description: 'Name of the table affected',
  })
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @ApiProperty({ example: 1, description: 'ID of the record that was changed' })
  @IsNumber()
  @IsNotEmpty()
  recordId: number;

  @ApiPropertyOptional({
    example: { rate: 10 },
    description: 'Previous data before change',
  })
  @IsObject()
  @IsOptional()
  oldData?: any;

  @ApiPropertyOptional({
    example: { rate: 15 },
    description: 'New data after change',
  })
  @IsObject()
  @IsOptional()
  newData?: any;

  @ApiPropertyOptional({
    example: '192.168.1.1',
    description: 'IP address of the user',
  })
  @IsString()
  @IsOptional()
  ipAddress?: string;
}
