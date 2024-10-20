import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../../entity/user.entity';
import { EntityNames } from 'src/common/enum/entity.enum';
import { OrderEntity } from 'src/modules/order/entities/order.entity';

@Entity(EntityNames.Address)
export class AddressEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255 })
  name: string; 

  @Column({ length: 255 })
  country: string; 

  @Column({ length: 255 })
  state: string; 

  @Column({ length: 255 })
  city: string; 

  @Column({ length: 255 })
  street: string;

  @Column({ length: 20, nullable: true })
  postalCode: string;

  @Column({ length: 20, nullable: true })
  phoneNumber: string;

  @Column()
  userId: number;
  
  @ManyToOne(() => UserEntity, (user) => user.address, {
    onDelete: 'CASCADE',
  })
  user: UserEntity; 

  @OneToMany(() => OrderEntity, (orders) => orders.address)
  orders: OrderEntity;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
