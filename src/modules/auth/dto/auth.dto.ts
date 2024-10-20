import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMobilePhone, IsString, Length } from 'class-validator';
import { AuthType } from '../enum/type.enum';
import { AuthMethod } from '../enum/method.enum';

export class AuthDto {
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  username: string;
  @ApiProperty()
  @IsEnum(AuthType)
  type: AuthType;
  @ApiProperty()
  @IsEnum(AuthMethod)
  method: AuthMethod;
}
export class SendOtpDto{
  @ApiProperty()
  @IsMobilePhone()
  mobile: string;
}
export class CheckOtpDto {
  @ApiProperty()
  @IsString()
  @Length(5, 5, { message: 'incorrect code' })
  code: string;

  @ApiProperty()
  @IsMobilePhone()
  mobile: string;
}
