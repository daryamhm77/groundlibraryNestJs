import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { LibraryEntity } from '../libraries/entities/library.entity';
import { LibrariesService } from '../libraries/libraries.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity, LibraryEntity])],
  controllers: [BooksController],
  providers: [BooksService, LibrariesService],
})
export class BooksModule {}
