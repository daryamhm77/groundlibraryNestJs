import { Module } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { OwnerController } from './owner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerEntity } from './entities/owner.entity';
import { OwnerOtpEntity } from './entities/otp.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([OwnerEntity, OwnerOtpEntity ])],
  controllers: [OwnerController],
  providers: [OwnerService, JwtService],
  exports: [OwnerService, JwtService, TypeOrmModule],
})
export class OwnerModule {}
