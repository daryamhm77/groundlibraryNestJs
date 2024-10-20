import { Controller, Get, Post, Body, Query, Res } from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { PaymentDto } from '../payment/dto/create-payment.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PaymentService } from './payment.service';

@Controller('Payment')
@ApiTags('Payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @AuthDecorator()
  async gatewayUrl(@Body() paymentDto: PaymentDto) {
    return this.paymentService.getGatewayUrl(paymentDto);
  }

  @AuthDecorator()
  @Get('/verify')
  async verifyPayment(
    @Query('Authority') authority: string,
    @Query('Status') status: string,
    @Res() res: Response,
  ) {
    const url = await this.paymentService.verify(authority, status);
    return res.redirect(url); 
  }
}
