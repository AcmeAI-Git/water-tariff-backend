import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ example: 1, description: 'ID of the user to notify' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: 'New Bill Generated',
    description: 'Title of the notification',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Your water bill for December 2025 is ready',
    description: 'Notification message',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: 'Bill',
    description: 'Type of notification',
    enum: ['Bill', 'Approval', 'Reminder', 'System'],
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['Bill', 'Approval', 'Reminder', 'System'])
  type: string;
}
