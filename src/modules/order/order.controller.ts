import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  BadRequestException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { PaymentDto } from '../payment/dto/create-payment.dto';

import { CustomRequest } from 'src/common/interface/user.interface';
import { BasketType } from '../basket/basket.type';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('orders')
@ApiTags('Orders')
@AuthDecorator()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() paymentDto: PaymentDto, @Req() req: CustomRequest) {
    const basket: BasketType = req.body.basket;
    if (!basket || basket.bookList.length === 0) {
      throw new BadRequestException('The basket is empty');
    }
    return await this.orderService.create(basket, paymentDto);
  }

  @Get(':id')
  async getOrder(@Param('id') id: number) {
    const order = await this.orderService.findOne(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  @Get()
  async getAllOrdered() {
    return await this.orderService.getAllOrdered();
  }

  @Patch(':id/in-process')
  async setInProcess(@Param('id') id: number) {
    return await this.orderService.setInProcess(id);
  }

  @Patch(':id/packed')
  async setPacked(@Param('id') id: number) {
    return await this.orderService.setPacked(id);
  }

  @Patch(':id/in-transit')
  async setToTransit(@Param('id') id: number) {
    return await this.orderService.setToTransit(id);
  }

  @Patch(':id/delivered')
  async delivery(@Param('id') id: number) {
    return await this.orderService.delivery(id);
  }

  @Patch(':id/canceled')
  async cancelOrder(@Param('id') id: number) {
    return await this.orderService.canceled(id);
  }
}
