import { EntityNames } from 'src/common/enum/entity.enum';
import { BasketEntity } from 'src/modules/basket/entity/basket.entity';
import { LibraryEntity } from 'src/modules/libraries/entities/library.entity';
import { OrderItemsEntity } from 'src/modules/order/entities/orderItems.entity';
import { OwnerEntity } from 'src/modules/owner/entities/owner.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity(EntityNames.Books)
export class BookEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 200 })
  @Index()
  title: string;

  @Column({ length: 100 })
  author: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('int')
  stock: number;

  @Column({ length: 20 })
  isbn: string;

  @Column()
  ownerId: number;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => LibraryEntity, (library) => library.books, {
    eager: true,
    onDelete: 'CASCADE',
  })
  library: LibraryEntity;

  @ManyToOne(() => OwnerEntity, (owner) => owner.books)
  owner: OwnerEntity;

  @OneToMany(() => BasketEntity, (baskets) => baskets.book)
  baskets: BasketEntity;

  @OneToMany(() => OrderItemsEntity, (orders) => orders.book)
  orders: OrderItemsEntity[];
  
}
