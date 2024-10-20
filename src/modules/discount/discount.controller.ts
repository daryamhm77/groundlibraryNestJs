import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { DiscountService } from './discount.service';
import { SwaggerConsumes } from 'src/common/enum/swagger-consumes.enum';
import { OwnerAuth } from 'src/common/decorators/auth.decorator';
import { CreateDiscountDto } from './dto/discount.dto';

@Controller('discount')
@ApiTags('Discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @OwnerAuth()
  create(@Body() discountDto: CreateDiscountDto) {
    return this.discountService.create(discountDto);
  }

  @Get()
  @OwnerAuth()
  findAll() {
    return this.discountService.findAll();
  }
  @Delete('/:id')
  @OwnerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.discountService.delete(id);
  }
}
