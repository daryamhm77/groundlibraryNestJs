import { EntityNames } from 'src/common/enum/entity.enum';
import { BookEntity } from 'src/modules/books/entities/book.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { OwnerEntity } from 'src/modules/owner/entities/owner.entity';
import { OrderItemStatus } from '../enum/status.enum';

@Entity(EntityNames.OrderItems)
export class OrderItemsEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  orderId: number;

  @Column()
  bookId: number;

  @Column()
  count: number;

  @Column()
  ownerId: number;

  @Column({
    type: 'enum',
    enum: OrderItemStatus,
    default: OrderItemStatus.Pending,
  })
  status: string;

  @ManyToOne(() => BookEntity, (book) => book.orders)
  book: BookEntity;

  @ManyToOne(() => OrderEntity, (orders) => orders.items)
  orders: OrderEntity;

  @ManyToOne(() => OwnerEntity, (owner) => owner.orders)
  owner: OwnerEntity;
}
