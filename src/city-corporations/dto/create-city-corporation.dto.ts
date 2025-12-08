import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCityCorporationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  address: string;
}
