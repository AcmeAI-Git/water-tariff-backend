import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateApprovalRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  moduleName: string;

  @IsNumber()
  @IsNotEmpty()
  recordId: number;

  @IsNumber()
  @IsNotEmpty()
  requestedBy: number;

  @IsString()
  @IsOptional()
  comments?: string;
}
