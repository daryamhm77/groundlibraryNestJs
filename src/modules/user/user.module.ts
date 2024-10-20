import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { OtpEntity } from './entity/otp.entity';
import { ProfileEntity } from './entity/profile.entity';
import { AddressModule } from './address/address.module';
import { AuthService } from '../auth/auth.service';
import { TokensService } from '../auth/tokens.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, OtpEntity, ProfileEntity]),
    AddressModule,
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, TokensService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
