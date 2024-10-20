import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIdentityCard,
  IsMobilePhone,
  Length,
} from 'class-validator';

export class OwnerSignupDto {
  @ApiProperty()
  @Length(3, 50)
  library_name: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  @Length(3, 50)
  manager_name: string;

  @ApiProperty()
  @Length(3, 50)
  manager_family: string;

  @ApiProperty()
  @IsMobilePhone('fa-IR', {}, { message: 'mobile number is invalid' })
  phone: string;
}

export class OwnerInformationDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  
  @ApiProperty()
  @IsIdentityCard('IR')
  national_code: string;
}
