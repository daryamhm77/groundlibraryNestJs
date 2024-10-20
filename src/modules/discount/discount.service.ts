import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountEntity } from './entity/discount.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountEntity)
    private discountRepository: Repository<DiscountEntity>,
  ) {}

  async create(discountDto: CreateDiscountDto) {
    const { code, expiresAt, limit, percent, usage, active } = discountDto;
    await this.checkExistCode(code);
    const discountObject: DeepPartial<DiscountEntity> = { code };
    if ((!percent && !percent) || (percent && percent)) {
      throw new BadRequestException(
        'You must enter one of the percent or percent fields ',
      );
    }
    if (percent && !isNaN(parseFloat(percent.toString()))) {
      discountObject['percent'] = percent;
    }

    if (expiresAt && !isNaN(parseInt(expiresAt.toString()))) {
      const time = 1000 * 60 * 60 * 24;
      discountObject['expires_in'] = new Date(new Date().getTime() + time);
    }
    if (limit && !isNaN(parseInt(limit.toString()))) {
      discountObject['limit'] = limit;
    }

    const discount = this.discountRepository.create(discountObject);
    await this.discountRepository.save(discount);
    return {
      message: 'created',
    };
  }
  async checkExistCode(code: string) {
    const discount = await this.discountRepository.findOneBy({ code });
    if (discount) throw new ConflictException('already exist code');
  }
  async findOneByCode(code: string) {
    const discount = await this.discountRepository.findOneBy({ code });
    if (!discount) throw new NotFoundException('not found discount code');
    return discount;
  }
  async findAll() {
    return await this.discountRepository.find({});
  }
  async delete(id: number) {
    const discount = await this.discountRepository.findOneBy({ id });
    if (!discount) throw new NotFoundException();
    await this.discountRepository.delete({ id });
    return {
      message: 'deleted',
    };
  }
}
