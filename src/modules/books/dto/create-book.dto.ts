import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  Min,
  Length,
  IsOptional,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  author: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  stock: number;

  @IsNotEmpty()
  @IsString()
  @Length(10, 20)
  isbn: string;
  
  @IsNotEmpty()
  @IsInt()
  libraryId: number;
}
