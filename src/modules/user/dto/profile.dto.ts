import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Gender } from '../enum/gender.enum';
import { ValidationMessage } from 'src/common/enum/message.enum';

export class ProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Length(3, 100)
  nick_name: string;

  @ApiPropertyOptional({ nullable: true, enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender: string;

  @ApiPropertyOptional({ nullable: true, example: '1996-02-22T12:01:26.487Z' })
  birthday: Date;

  @ApiPropertyOptional({ nullable: true })
  genres: string;
  
  @ApiPropertyOptional({ nullable: true })
  address: string;
}
export class ChangeEmailDto {
  @ApiProperty()
  @IsEmail({}, { message: ValidationMessage.InvalidEmailFormat })
  email: string;
}
export class ChangeUsernameDto {
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  username: string;
}
