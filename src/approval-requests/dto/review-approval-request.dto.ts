import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ReviewApprovalRequestDto {
  @IsNumber()
  @IsNotEmpty()
  reviewedBy: number;

  @IsString()
  @IsNotEmpty()
  status: string; // 'Approved' or 'Rejected'

  @IsString()
  @IsOptional()
  comments?: string;
}
