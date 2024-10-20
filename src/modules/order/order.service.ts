import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { AddressEntity } from '../user/address/entities/address.entity';
import { PaymentDto } from '../payment/dto/create-payment.dto';
import { BasketType } from '../basket/basket.type';
import { CustomRequest } from 'src/common/interface/user.interface';
import { OrderStatus } from './enum/status.enum';
import { OrderItemsEntity } from './entities/orderItems.entity';

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    @Inject(REQUEST) private req: CustomRequest,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
    private dataSource: DataSource,
  ) {}
  async create(basket: BasketType, paymentDto: PaymentDto) {
    const { addressId, description = null } = paymentDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const { id: userId } = this.req.user;
      const address = await this.addressRepository.findOneBy({
        id: addressId,
        userId,
      });
      if (!address) throw new NotFoundException('not found address');
      const { bookList, payment_amount, total_amount, total_discount_amount } =
        basket;
      let order = queryRunner.manager.create(OrderEntity, {
        addressId,
        userId,
        total_amount,
        description,
        discount_amount: total_discount_amount,
        payment_amount,
        status: OrderStatus.Pending,
      });
      order = await queryRunner.manager.save(OrderEntity, order);
      const orderItems: DeepPartial<OrderItemsEntity>[] = [];
      for (const item of bookList) {
        orderItems.push({
          count: item.count,
          bookId: item.bookId,
          orderId: item.orderId,
          ownerId: item.ownerId,
          status: OrderStatus.Pending,
        });
      }
      if (orderItems.length > 0) {
        await queryRunner.manager.insert(OrderItemsEntity, orderItems);
      } else {
        throw new BadRequestException('your food list is empty');
      }
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) throw new NotFoundException();
    return order;
  }
  async save(order: OrderEntity) {
    return await this.orderRepository.save(order);
  }
  getAllOrdered() {
    return this.orderRepository.find({
      where: {
        status: OrderStatus.Ordered,
      },
    });
  }
  async findOrdersByUserId(userId: number) {
    const orders = await this.orderRepository.find({
      where: { userId },
      relations: ['orderItems', 'address'], 
    });

    if (orders.length === 0) {
      throw new NotFoundException('No orders found for this user');
    }

    return orders;
  }
  async setInProcess(orderId: number) {
    const order = await this.findOne(orderId);
    if (order.status !== OrderStatus.Ordered)
      throw new BadRequestException('order not in paid queue');
    order.status = OrderStatus.InProcess;
    await this.orderRepository.save(order);
    return {
      message: 'changes status successfully',
    };
  }
  async setPacked(orderId: number) {
    const order = await this.findOne(orderId);
    if (order.status !== OrderStatus.InProcess)
      throw new BadRequestException('order not in process queue');
    order.status = OrderStatus.Packed;
    await this.orderRepository.save(order);
    return {
      message: 'changes status successfully',
    };
  }
  async setToTransit(orderId: number) {
    const order = await this.findOne(orderId);
    if (order.status !== OrderStatus.Packed)
      throw new BadRequestException('order not packed');
    order.status = OrderStatus.InTransit;
    await this.orderRepository.save(order);
    return {
      message: 'changes status successfully',
    };
  }
  async delivery(orderId: number) {
    const order = await this.findOne(orderId);
    if (order.status !== OrderStatus.InTransit)
      throw new BadRequestException('order not in transit');
    order.status = OrderStatus.Delivered;
    await this.orderRepository.save(order);
    return {
      message: 'changes status successfully',
    };
  }
  async canceled(orderId: number) {
    const order = await this.findOne(orderId);
    if (
      order.status === OrderStatus.Canceled ||
      order.status === OrderStatus.Pending
    )
      throw new BadRequestException('you can not canceled this order');
    order.status = OrderStatus.Canceled;
    await this.orderRepository.save(order);
    return {
      message: 'canceled successfully',
    };
  }
}
