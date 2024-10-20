import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entity/profile.entity';
import { ProfileDto } from './dto/profile.dto';
import { Gender } from './enum/gender.enum';
import { isDate } from 'class-validator';
import { REQUEST } from '@nestjs/core';
import {
  AuthMessage,
  BadRequestMessage,
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
} from 'src/common/enum/message.enum';
import { CustomRequest } from 'src/common/interface/user.interface';
import { OtpEntity } from './entity/otp.entity';
import { AuthService } from '../auth/auth.service';
import { AuthMethod } from '../auth/enum/method.enum';
import { TokensService } from '../auth/tokens.service';
import { CookieKeys } from 'src/common/enum/cookie.enum';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    @Inject(REQUEST) private request: CustomRequest,
    private authService: AuthService,
    private tokensService: TokensService,
  ) {}
  async changeProfile(profileDto: ProfileDto) {
    const { id: userId, profileId } = this.request.user;
    let profile = await this.profileRepository.findOneBy({ userId });
    const { nick_name, gender, genres, birthday, address } = profileDto;
    if (profile) {
      if (nick_name) profile.nick_name = nick_name;
      if (genres) profile.genres = genres;
      if (address) profile.address = address;
      if (birthday && isDate(new Date(birthday)))
        profile.birthday = new Date(birthday);
      if (gender && Object.values(Gender as any).includes(gender))
        profile.gender = gender;
    } else {
      profile = this.profileRepository.create({
        nick_name,
        gender,
        genres,
        birthday,
      });
    }
    profile = await this.profileRepository.save(profile);
    if (!profileId) {
      await this.userRepository.update(
        { id: userId },
        { profileId: profile.id },
      );
    }
    return {
      message: PublicMessage.Updated,
    };
  }
  async changeEmail(email: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ email });
    if (user && user?.id !== id) {
      throw new ConflictException(ConflictMessage.Email);
    } else if (user && user?.id === id) {
      return {
        message: PublicMessage.Updated,
      };
    }
    await this.userRepository.update({ id }, { new_email: email });
    const token = await this.authService.saveOtp(id, AuthMethod.Email);
    const otpEmail = this.tokensService.createEmailToken({ email });
    return {
      code: otpEmail,
      token,
    };
  }
  async verifyEmail(code: string) {
    const { id: userId, new_email } = this.request.user;
    const token = this.request.cookies?.[CookieKeys.EmailOTP];
    if (!token) throw new BadRequestException(AuthMessage.ExpiredCode);
    const { email } = this.tokensService.verifyEmailToken(token);
    if (email !== new_email) {
      throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    }
    const otp = await this.checkOtp(userId, code);
    if (otp.method !== AuthMethod.Email) {
      throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    }
    await this.userRepository.update(
      { id: userId },
      {
        email,
        verify_email: true,
        new_email: null,
      },
    );
    return {
      message: PublicMessage.Updated,
    };
  }
  async changeUsername(username: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ username });
    if (user && user.id !== id) {
      throw new ConflictException(ConflictMessage.Username);
    } else if (user && user?.id === id) {
      return {
        message: PublicMessage.Updated,
      };
    }
    await this.userRepository.update({ id }, { username });
    return {
      message: PublicMessage.Updated,
    };
  }
  async checkOtp(userId: number, code: string) {
    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new BadRequestException(NotFoundMessage.NotFound);
    const now = new Date();
    if (otp.expiresIn < now)
      throw new BadRequestException(AuthMessage.ExpiredCode);
    if (otp.code !== code) throw new BadRequestException(AuthMessage.TryAgain);
    return otp;
  }
}
