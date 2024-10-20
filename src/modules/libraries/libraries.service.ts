import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryEntity } from './entities/library.entity';
import { Repository } from 'typeorm';
import { OwnerEntity } from '../owner/entities/owner.entity';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/common/interface/user.interface';
import { PublicMessage } from 'src/common/enum/message.enum';

@Injectable()
export class LibrariesService {
  constructor(
    @InjectRepository(LibraryEntity)
    private libraryRepository: Repository<LibraryEntity>,
    @InjectRepository(OwnerEntity)
    private ownerRepository: Repository<OwnerEntity>,
    @Inject(REQUEST) private request: CustomRequest,
  ) {}
  async create(createLibraryDto: CreateLibraryDto) {
    const { name, description, genres } = createLibraryDto;
    const { id: ownerId } = this.request.user;
    const owner = await this.ownerRepository.findOneBy({ id: ownerId });
    const existLibrary = await this.libraryRepository.findOne({
      where: { name, owner: { id: owner.id } },
    });
    if (existLibrary) {
      throw new BadRequestException('you already created this library!');
    }
    const library = this.libraryRepository.create({
      name,
      description,
      genres,
      owner,
    });
    await this.libraryRepository.save(library);
    return {
      message: PublicMessage.Created,
    };
  }

  findAll() {
    return this.libraryRepository.find({
      relations: {
        owner: true,
        books: true,
      },
    });
  }

  async findOne(id: number) {
    const library = await this.libraryRepository.findOne({
      where: { id },  
      relations: ['owner', 'books'], 
    });
  
    if (!library) {
      throw new NotFoundException('Library not found!');
    }
  
    return library;
  }
  

  async update(id: number, updateLibraryDto: UpdateLibraryDto) {
    const library = await this.findOne(id);
    const { id: ownerId } = this.request.user;
    const owner = await this.ownerRepository.findOneBy({ id: ownerId });
    if (updateLibraryDto.name && updateLibraryDto.name !== library.name) {
      const existingLibrary = await this.libraryRepository.findOne({
        where: { name: updateLibraryDto.name, owner: { id: owner.id } },
      });
      if (existingLibrary) {
        throw new BadRequestException(
          'شما قبلاً کتابخانه‌ای با این نام ایجاد کرده‌اید',
        );
      }
    }

    Object.assign(library, updateLibraryDto);
    return this.libraryRepository.save(library);
  }

  async remove(id: number) {
    const library = await this.findOne(id);
    await this.libraryRepository.remove(library);
  }
}
