import { Controller, Post, Body } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CheckOtpDto, SendOtpDto } from '../auth/dto/auth.dto';
import { OwnerAuth } from 'src/common/decorators/auth.decorator';
import { OwnerInformationDto, OwnerSignupDto } from './dto/create-owner.dto';
import { SwaggerConsumes } from 'src/common/enum/swagger-consumes.enum';

@Controller('owner')
@ApiTags('Owner')
@OwnerAuth()
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Post('/send-otp')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  sendOtp(@Body() otpDto: SendOtpDto) {
    return this.ownerService.sendOtp(otpDto);
  }
  @Post('/signup')
  signup(@Body() ownerDto: OwnerSignupDto) {
    return this.ownerService.signup(ownerDto);
  }
  @Post('/check-otp')
  checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return this.ownerService.checkOtp(checkOtpDto);
  }
  @Post('/owner-information')
  ownerInformation(@Body() infoDto: OwnerInformationDto) {
    return this.ownerService.saveOwnerInformation(infoDto);
  }
}
