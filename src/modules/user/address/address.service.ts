import {
  Inject,
  Injectable,
  NotFoundException,
  Request,
  Scope,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/common/interface/user.interface';

@Injectable({ scope: Scope.REQUEST })
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
    @Inject(REQUEST) private req: CustomRequest,
  ) {}
  async create(createAddressDto: CreateAddressDto) {
    const user = this.req.user;
    const address = this.addressRepository.create({
      ...createAddressDto,
      user,
    });
    await this.addressRepository.save(address);
    return {
      message: 'address created:)',
    };
  }

  findAll() {
    const { id: userId } = this.req.user;
    return this.addressRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(id: number) {
    const { id: userId } = this.req.user;
    const address = await this.addressRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!address) throw new NotFoundException('address not founded!');
    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.findOne(id);
    Object.assign(address, updateAddressDto);
    return this.addressRepository.save(address);
  }

  async remove(id: number) {
    const address = await this.findOne(id);
    await this.addressRepository.remove(address);
  }
}
