import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  Length,
  IsBoolean,
} from 'class-validator';

export class CreateDiscountDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  code: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  percent: number;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  usage?: number;

  @IsOptional()
  @IsBoolean()
  @Min(1)
  active?: boolean;
}
