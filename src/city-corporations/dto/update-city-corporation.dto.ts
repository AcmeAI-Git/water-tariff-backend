import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateCityCorporationDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  code?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  address?: string;
}
