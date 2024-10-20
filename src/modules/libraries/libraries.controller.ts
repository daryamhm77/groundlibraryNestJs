import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LibrariesService } from './libraries.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { OwnerAuth } from 'src/common/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { SKipAuth } from 'src/common/decorators/skip-auth.decorator';

@Controller('libraries')
@ApiTags('Library')
export class LibrariesController {
  constructor(private readonly librariesService: LibrariesService) {}

  @Post()
  @OwnerAuth()
  create(@Body() createLibraryDto: CreateLibraryDto) {
    return this.librariesService.create(createLibraryDto);
  }

  @Get()
  @SKipAuth()
  findAll() {
    return this.librariesService.findAll();
  }

  @Get(':id')
  @SKipAuth()
  findOne(@Param('id') id: string) {
    return this.librariesService.findOne(+id);
  }
  @OwnerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLibraryDto: UpdateLibraryDto) {
    return this.librariesService.update(+id, updateLibraryDto);
  }
  @OwnerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.librariesService.remove(+id);
  }
}
