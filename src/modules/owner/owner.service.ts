import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OwnerEntity } from './entities/owner.entity';
import { Repository } from 'typeorm';
import { OwnerOtpEntity } from './entities/otp.entity';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { OwnerInformationDto, OwnerSignupDto } from './dto/create-owner.dto';
import { CheckOtpDto, SendOtpDto } from '../auth/dto/auth.dto';
import { randomInt } from 'crypto';
import { CustomRequest } from 'src/common/interface/user.interface';
import { ownerStatus } from './enum/status.enum';
import { PayloadType } from './payload';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(OwnerEntity)
    private ownerRepository: Repository<OwnerEntity>,
    @InjectRepository(OwnerOtpEntity)
    private ownerOtpRepository: Repository<OwnerOtpEntity>,
    private jwtService: JwtService,
    @Inject(REQUEST) private req: CustomRequest,
  ) {}
  async signup(signupDto: OwnerSignupDto) {
    const { city, manager_family, manager_name, phone } = signupDto;
    const owner = await this.ownerRepository.findOneBy({ phone });
    if (owner) throw new ConflictException('owner account already exist');
    const account = this.ownerRepository.create({
      manager_name,
      manager_family,
      phone,
      city,
    });
    await this.ownerRepository.save(account);
    await this.createOtpForOwner(account);
    return {
      message: 'otp code sent successfully',
    };
  }
  async checkOtp(otpDto: CheckOtpDto) {
    const { code, mobile } = otpDto;
    const now = new Date();
    const owner = await this.ownerRepository.findOne({
      where: { phone: mobile },
      relations: {
        otp: true,
      },
    });
    if (!owner || !owner?.otp)
      throw new UnauthorizedException('Not Found Account');
    const otp = owner?.otp;
    if (otp?.code !== code)
      throw new UnauthorizedException('Otp code is incorrect');
    if (otp.expires_in < now)
      throw new UnauthorizedException('Otp Code is expired');
    if (!owner.mobile_verify) {
      await this.ownerRepository.update(
        { id: owner.id },
        {
          mobile_verify: true,
        },
      );
    }
    const { accessToken, refreshToken } = this.makeTokens({
      id: owner.id,
    });
    return {
      accessToken,
      refreshToken,
      message: 'You logged-in successfully',
    };
  }
  async sendOtp(otpDto: SendOtpDto) {
    const { mobile } = otpDto;
    const owner = await this.ownerRepository.findOneBy({ phone: mobile });
    if (!owner) {
      throw new UnauthorizedException('not found account');
    }
    await this.createOtpForOwner(owner);
    return {
      message: 'sent code successfully',
    };
  }
  async createOtpForOwner(owner: OwnerEntity) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();
    let otp = await this.ownerOtpRepository.findOneBy({
      ownerId: owner.id,
    });
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException('otp code not expired');
      }
      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.ownerOtpRepository.create({
        code,
        expires_in: expiresIn,
        ownerId: owner.id,
      });
    }
    otp = await this.ownerOtpRepository.save(otp);
    owner.otpId = otp.id;
    await this.ownerRepository.save(owner);
  }
  async saveOwnerInformation(infoDto: OwnerInformationDto) {
    const { id } = this.req.user;
    const { email, national_code } = infoDto;
    let owner = await this.ownerRepository.findOneBy({ national_code });
    if (owner && owner.id !== id) {
      throw new ConflictException('national code already used');
    }
    owner = await this.ownerRepository.findOneBy({ email });
    if (owner && owner.id !== id) {
      throw new ConflictException('email already used');
    }
    await this.ownerRepository.update(
      { id },
      {
        email,
        national_code,
        status: ownerStatus.ownerInformation,
      },
    );
    return {
      message: 'updated information successfully',
    };
  }
  makeTokens(payload: PayloadType) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '30d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '1y',
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<PayloadType>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      if (typeof payload === 'object' && payload?.id) {
        const owner = await this.ownerRepository.findOneBy({
          id: payload.id,
        });
        if (!owner) {
          throw new UnauthorizedException('login on your account ');
        }
        return {
          id: owner.id,
          first_name: owner.manager_name,
          last_name: owner.manager_family,
          mobile: owner.phone,
        };
      }
      throw new UnauthorizedException('login on your account ');
    } catch (error) {
      throw new UnauthorizedException('login on your account ');
    }
  }
}
