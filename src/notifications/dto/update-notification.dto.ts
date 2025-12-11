import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationDto {
  @ApiPropertyOptional({
    example: 'Read',
    description: 'Status of the notification',
    enum: ['Unread', 'Read'],
  })
  @IsString()
  @IsOptional()
  @IsEnum(['Unread', 'Read'])
  status?: string;
}
