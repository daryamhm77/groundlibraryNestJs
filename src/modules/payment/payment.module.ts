import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { BasketService } from '../basket/basket.service';
import { BasketEntity } from '../basket/entity/basket.entity';
import { AuthModule } from '../auth/auth.module';
import { DiscountEntity } from '../discount/entity/discount.entity';
import { BooksService } from '../books/books.service';
import { DiscountService } from '../discount/discount.service';
import { BookEntity } from '../books/entities/book.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderService } from '../order/order.service';
import { AddressEntity } from '../user/address/entities/address.entity';
import { PaymentEntity } from './entities/payment.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      BasketEntity,
      DiscountEntity,
      BookEntity,
      OrderEntity,
      AddressEntity,
      PaymentEntity,
    ]),
  ],
  providers: [
    PaymentService,
    BasketService,
    BooksService,
    DiscountService,
    OrderService,
  ],
  controllers: [PaymentController],
  exports: [],
})
export class PaymentModule {}
