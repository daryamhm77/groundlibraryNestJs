import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/common/interface/user.interface';
import { LibrariesService } from '../libraries/libraries.service';
import { PublicMessage } from 'src/common/enum/message.enum';

@Injectable()
export class BooksService {
  booksRepository: any;
  constructor(
    @InjectRepository(BookEntity)
    private bookRepository: Repository<BookEntity>,
    private libraryService: LibrariesService,
    @Inject(REQUEST) private req: CustomRequest,
  ) {}
  async create(createBookDto: CreateBookDto) {
    const { id: ownerId } = this.req.user;
    const { title, author, price, description, stock, libraryId, isbn } =
      createBookDto;
    const library = await this.libraryService.findOne(libraryId);
    if (library.owner.id !== ownerId) {
      throw new ForbiddenException(
        'you have not permission to add book in this library',
      );
    }
    const existedBook = await this.bookRepository.findOneBy({ isbn });

    if (existedBook) {
      throw new BadRequestException('this book is already existed!');
    }

    const book = this.bookRepository.create({
      title,
      author,
      price,
      description,
      stock,
      library,
    });
    await this.bookRepository.save(book);

    return {
      message: PublicMessage.Created,
    };
  }

  findAll() {
    return this.bookRepository.find({
      relations: {
        library: true,
      },
    });
  }

  async findOne(id: number) {
    const book = await this.booksRepository.findOne(id, {
      relations: ['library'],
    });
    if (!book) {
      throw new NotFoundException('book is not founded!');
    }
    return book;
  }
  async getOne(id: number) {
    const item = await this.bookRepository.findOne({
      where: { id },
    });
    if (!item) throw new NotFoundException();
    return item;
  }
  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.findOne(id);
    const { id: ownerId } = this.req.user;
    if (book.library.owner.id !== ownerId) {
      throw new ForbiddenException(
        "you don't have  permission to update this book!",
      );
    }
    if (updateBookDto.libraryId) {
      const newLibrary = await this.libraryService.findOne(
        updateBookDto.libraryId,
      );
      if (newLibrary.owner.id !== ownerId) {
        throw new ForbiddenException("you don't have permission!");
      }
      book.library = newLibrary;
    }
    Object.assign(book, updateBookDto);
    await this.booksRepository.save(book);
    return {
      message: PublicMessage.Updated,
    };
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    const { id: ownerId } = this.req.user;

    if (book.library.owner.id !== ownerId) {
      throw new ForbiddenException(
        'you have not permission to remove this book!',
      );
    }

    await this.booksRepository.remove(book);
  }
}
