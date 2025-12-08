import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';

export class UpdateZoneDto {
  @IsString()
  @IsOptional()
  @MaxLength(20)
  zoneNo?: string;

  @IsNumber()
  @IsOptional()
  cityCorporationId?: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  cityName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  tariffCategory?: string;
}
