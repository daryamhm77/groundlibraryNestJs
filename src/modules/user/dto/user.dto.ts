import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { UserType } from '../enum/userType.enum';

export class UserDto {
  @IsString()
  @Length(3, 50)
  username: string;

  @IsString()
  @Length(6, 100)
  password: string;

  @IsEmail()
  @Length(5, 100)
  email: string;

  @IsString()
  @Length(2, 100)
  fullName: string;

  @IsEnum(UserType)
  type: UserType;
}
