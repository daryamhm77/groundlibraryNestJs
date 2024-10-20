import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { EntityNames } from 'src/common/enum/entity.enum';
import { BasketEntity } from 'src/modules/basket/entity/basket.entity';

@Entity(EntityNames.Discount)
export class DiscountEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 50 })
  code: string;

  @Column({ type: 'double' })
  percent: number;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column('int', { default: 1 })
  usage: number;

  @Column({ nullable: true })
  limit: number;

  @Column({ nullable: true })
  ownerId: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => BasketEntity, (basket) => basket.discount)
  baskets: BasketEntity[];
}
