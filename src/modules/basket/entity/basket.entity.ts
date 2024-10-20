import { EntityNames } from 'src/common/enum/entity.enum';
import { BookEntity } from 'src/modules/books/entities/book.entity';
import { DiscountEntity } from 'src/modules/discount/entity/discount.entity';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity(EntityNames.Basket)
export class BasketEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ nullable: true })
  bookId: number;
  @Column()
  userId: number;

  @Column({ nullable: true })
  discountId: number;

  @Column({ nullable: true })
  count: number;

  @ManyToOne(() => BookEntity, (book) => book.baskets, { onDelete: 'CASCADE' })
  book: BookEntity;

  @ManyToOne(() => UserEntity, (user) => user.basket, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => DiscountEntity, (discount) => discount.baskets, {
    onDelete: 'CASCADE',
  })
  discount: DiscountEntity;
}
