import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateLibraryDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 50)
  genres: string;

  @IsOptional()
  @IsString()
  description?: string;
}
