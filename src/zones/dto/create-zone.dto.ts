import { IsString, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class CreateZoneDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  zoneNo: string;

  @IsNumber()
  @IsNotEmpty()
  cityCorporationId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  cityName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tariffCategory: string;
}
