import { Module } from '@nestjs/common';
import { LibrariesService } from './libraries.service';
import { LibrariesController } from './libraries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryEntity } from './entities/library.entity';
import { OwnerEntity } from '../owner/entities/owner.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([LibraryEntity, OwnerEntity])],
  controllers: [LibrariesController],
  providers: [LibrariesService, JwtService],
  exports: [LibrariesService, JwtService, TypeOrmModule],
})
export class LibrariesModule {}
