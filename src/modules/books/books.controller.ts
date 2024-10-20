import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { OwnerAuth } from 'src/common/decorators/auth.decorator';
import { SKipAuth } from 'src/common/decorators/skip-auth.decorator';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @OwnerAuth()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }
  @SKipAuth()
  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @SKipAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Patch(':id')
  @OwnerAuth()
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  @OwnerAuth()
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
