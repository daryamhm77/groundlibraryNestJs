import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AccessTokenPayload,
  CookiePayload,
  EmailTokenPayload,
} from './types/payload';
import { Keys } from 'src/common/env/env';
import { AuthMessage, BadRequestMessage } from 'src/common/enum/message.enum';

@Injectable()
export class TokensService {
  constructor(private jwtService: JwtService) {}

  createOtpToken(payload: CookiePayload) {
    const token = this.jwtService.sign(payload, {
      secret: Keys.OTP_TOKEN_SECRET,
      expiresIn: 60 * 2,
    });
    return token;
  }
  verifyToken(token: string){
    try {
      return this.jwtService.verify(token, {
        secret: Keys.OTP_TOKEN_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException(AuthMessage.TryAgain);
    }
  }
  createAccessToken(payload: AccessTokenPayload) {
    const token = this.jwtService.sign(payload, {
      secret: Keys.ACCESS_TOKEN_SECRET,
      expiresIn: 60 * 2,
    });
    return token;
  }
  verifyAccessToken(token: string): CookiePayload {
    try {
      return this.jwtService.verify(token, {
        secret: Keys.ACCESS_TOKEN_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException(AuthMessage.LoginAgain);
    }
  }
  createEmailToken(payload: EmailTokenPayload) {
    const token = this.jwtService.sign(payload, {
      secret: Keys.EMAIL_TOKEN_SECRET,
      expiresIn: 60 * 2,
    });
    return token;
  }
  verifyEmailToken(token: string): EmailTokenPayload {
    try {
      return this.jwtService.verify(token, {
        secret: Keys.EMAIL_TOKEN_SECRET,
      });
    } catch (error) {
      throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    }
  }
}
