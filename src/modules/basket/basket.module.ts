import { Module } from '@nestjs/common';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketEntity } from './entity/basket.entity';
import { DiscountEntity } from '../discount/entity/discount.entity';
import { DiscountService } from '../discount/discount.service';
import { BooksModule } from '../books/books.module';
import { OrderModule } from '../order/order.module';


@Module({
  imports: [
    AuthModule,
    BooksModule,
    OrderModule,
    TypeOrmModule.forFeature([BasketEntity, DiscountEntity]),
  ],
  controllers: [BasketController],
  providers: [BasketService, DiscountService],
})
export class BasketModule {}
