import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthMethod } from './enum/method.enum';
import { isEmail } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import {
  AuthMessage,
  BadRequestMessage,
  PublicMessage,
} from 'src/common/enum/message.enum';
import { randomInt } from 'crypto';
import { OtpEntity } from '../user/entity/otp.entity';
import { Response, Request } from 'express';
import { AuthResponse, GoogleUser } from './types/response';
import { CookieKeys } from 'src/common/enum/cookie.enum';
import { CookiesOptionsToken } from 'src/common/utils/cookie.util';
import { AuthDto } from './dto/auth.dto';
import { AuthType } from './enum/type.enum';
import { TokensService } from './tokens.service';
import { REQUEST } from '@nestjs/core';
import { ProfileEntity } from '../user/entity/profile.entity';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    private otpRepository: Repository<OtpEntity>,
    private tokenService: TokensService,
    @Inject(REQUEST) private request: Request,
  ) {}
  async userExisted(authDto: AuthDto, res: Response) {
    const { method, type, username } = authDto;
    let result: AuthResponse;
    switch (type) {
      case AuthType.Register:
        result = await this.register(method, username);
        return this.sendResponse(res, result);
      case AuthType.Login:
        result = await this.login(method, username);
        return this.sendResponse(res, result);
      default:
        throw new UnauthorizedException();
    }
  }
  async register(method: AuthMethod, username: string) {
    const validUserName = this.checkValidUserName(method, username);
    let user: UserEntity = await this.checkExistUser(method, validUserName);
    if (user) throw new ConflictException(AuthMessage.AlreadyExistAccount);
    if (method === AuthMethod.Username) {
      throw new BadRequestException(BadRequestMessage.InValidRegisterData);
    }
    user = this.userRepository.create({
      [method]: username,
    });
    user = await this.userRepository.save(user);
    user.username = `m_${user.id}`;
    await this.userRepository.save(user);
    const otp = await this.saveOtp(user.id, method);
    const token = await this.tokenService.createOtpToken({ userId: user.id });
    return {
      token,
      code: otp.code,
    };
  }
  async login(method: AuthMethod, username: string) {
    const validUserName = this.checkValidUserName(method, username);
    const user: UserEntity = await this.checkExistUser(method, validUserName);
    if (!user) throw new UnauthorizedException(AuthMessage.NotFoundAccount);
    const otp = await this.saveOtp(user.id, method);
    const token = await this.tokenService.createOtpToken({ userId: user.id });
    return {
      token,
      code: otp.code,
    };
  }
  async sendResponse(res: Response, result: AuthResponse) {
    const { code, token } = result;

    res.cookie(CookieKeys.OTP, token, CookiesOptionsToken());

    return res.json({
      message: PublicMessage.SentOtp,
      code,
    });
  }
  async saveOtp(userId: number, method: AuthMethod) {
    const code = randomInt(10000, 99999).toString();
    const expiresIn = new Date(Date.now() + 1000 * 60 * 2);
    let otp = await this.otpRepository.findOneBy({ userId });
    let exitOtp = false;
    if (otp) {
      exitOtp = true;
      otp.code = code;
      otp.expiresIn = expiresIn;
      otp.method = method;
    } else {
      otp = this.otpRepository.create({
        code,
        expiresIn,
        method,
      });
    }
    await this.otpRepository.save(otp);
    if (!exitOtp) {
      await this.userRepository.update({ id: userId }, { otpId: otp.id });
    }
    return otp;
  }
  async checkOtp(code: string) {
    const token = this.request.cookies?.[CookieKeys.OTP];
    if (!token) throw new UnauthorizedException(AuthMessage.ExpiredCode);
    const { userId } = this.tokenService.verifyToken(token);
    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new UnauthorizedException(AuthMessage.LoginAgain);
    const now = new Date();
    if (otp.expiresIn < now)
      throw new UnauthorizedException(AuthMessage.ExpiredCode);
    if (otp.code !== code)
      throw new UnauthorizedException(AuthMessage.TryAgain);
    const accessToken = await this.tokenService.createAccessToken({ userId });
    if (otp.method === AuthMethod.Email) {
      await this.userRepository.update(
        { id: userId },
        {
          verify_email: true,
        },
      );
    }
    return {
      message: PublicMessage.LoggedIn,
      accessToken,
    };
  }
  async validateAccessToken(token: string) {
    const { userId } = this.tokenService.verifyAccessToken(token);
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException(AuthMessage.LoginAgain);

    return user;
  }
  async checkExistUser(method: AuthMethod, username: string) {
    let user: UserEntity;
    if (method === AuthMethod.Email) {
      user = await this.userRepository.findOneBy({ email: username });
    } else if (method === AuthMethod.Username) {
      user = await this.userRepository.findOneBy({ username });
    } else {
      throw new BadRequestException(BadRequestMessage.InValidLoginData);
    }
    return user;
  }
  checkValidUserName(method: AuthMethod, username: string) {
    switch (method) {
      case AuthMethod.Email:
        if (isEmail(username)) return username;
        throw new BadRequestException('Email is not correct!');
      case AuthMethod.Username:
        return username;
      default:
        throw new UnauthorizedException('Username data is not valid!');
    }
  }
  async googleAuth(userData: GoogleUser) {
    const { firstName, lastName, email } = userData;
    let token: string;
    let user = await this.userRepository.findOneBy({ email });
    if (user) {
      token = this.tokenService.createOtpToken({ userId: user.id });
    } else {
      user = this.userRepository.create({
        email,
        verify_email: true,
        username: email.split('@')['0'] + randomInt(10, 1000),
      });
      user = await this.userRepository.save(user);
      let profile = this.profileRepository.create({
        userId: (await user).id,
        nick_name: `${firstName} ${lastName}`,
      });
      profile = await this.profileRepository.save(profile);
      (await user).profileId = profile.id;
      await this.userRepository.save(user);
      token = this.tokenService.createAccessToken({ userId: user.id });
    }
    return {
      token,
    };
  }
}
