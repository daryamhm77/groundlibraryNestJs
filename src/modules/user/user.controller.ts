import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { UserService } from './user.service';
import { SwaggerConsumes } from 'src/common/enum/swagger-consumes.enum';
import { Body, Controller, Patch, Post, Put, Res } from '@nestjs/common';
import {
  ChangeEmailDto,
  ChangeUsernameDto,
  ProfileDto,
} from './dto/profile.dto';
import { CookieKeys } from 'src/common/enum/cookie.enum';
import { PublicMessage } from 'src/common/enum/message.enum';
import { CookiesOptionsToken } from 'src/common/utils/cookie.util';
import { CheckOtpDto } from '../auth/dto/auth.dto';
import { Response } from 'express';

@Controller('user')
@ApiTags('User')
@AuthDecorator()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Put('/profile')
  @ApiConsumes(SwaggerConsumes.MultipartData)
  changeProfile(@Body() profileDto: ProfileDto) {
    return this.userService.changeProfile(profileDto);
  }
  @Patch('/change-email')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changeEmail(@Body() emailDto: ChangeEmailDto, @Res() res: Response) {
    const { code, token } = await this.userService.changeEmail(emailDto.email);
    res.cookie(CookieKeys.EmailOTP, token, CookiesOptionsToken());
    return res.json({
      code,
      message: PublicMessage.SentOtp,
    });
  }
  @Post('/verify-email')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async verifyEmail(@Body() otpDto: CheckOtpDto) {
    return this.userService.verifyEmail(otpDto.code);
  }
  @Patch('/change-username')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changeUsername(@Body() usernameDto: ChangeUsernameDto) {
    return this.userService.changeUsername(usernameDto.username);
  }
}
