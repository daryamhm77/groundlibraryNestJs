import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
  IsPostalCode,
} from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  country: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  state: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  city: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  street: string;

  @IsOptional()
  @IsString()
  @IsPostalCode('any')
  postalCode?: string;

  @IsOptional()
  @IsString()
  @Length(10, 20)
  phoneNumber?: string;
}
