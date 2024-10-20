import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { OrderEntity } from './entities/order.entity';
import { OrderItemsEntity } from './entities/orderItems.entity';
import { AddressEntity } from '../user/address/entities/address.entity';

@Module({
  imports: [
    AuthModule,

    TypeOrmModule.forFeature([OrderEntity, OrderItemsEntity, AddressEntity]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [],
})
export class OrderModule {}
