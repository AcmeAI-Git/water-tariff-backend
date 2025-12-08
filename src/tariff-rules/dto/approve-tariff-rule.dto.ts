import { IsNumber, IsNotEmpty } from 'class-validator';

export class ApproveTariffRuleDto {
  @IsNumber()
  @IsNotEmpty()
  approvedBy: number;
}
