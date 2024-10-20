import { EntityNames } from 'src/common/enum/entity.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OwnerOtpEntity } from './otp.entity';
import { ownerStatus } from '../enum/status.enum';
import { LibraryEntity } from 'src/modules/libraries/entities/library.entity';
import { BookEntity } from 'src/modules/books/entities/book.entity';
import { OrderItemsEntity } from 'src/modules/order/entities/orderItems.entity';

@Entity(EntityNames.Owner)
export class OwnerEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  manager_name: string;

  @Column()
  manager_family: string;

  @Column()
  city: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  national_code: string;

  @Column()
  mobile_verify: boolean;

  @Column({ nullable: true, default: ownerStatus.Registered })
  status: string;

  @Column({ nullable: true })
  otpId: number;

  @OneToOne(() => OwnerOtpEntity, (otp) => otp.owner)
  @JoinColumn()
  otp: OwnerOtpEntity;


  @OneToMany(() => LibraryEntity, (library) => library.owner)
  library: LibraryEntity[];
  
  @OneToMany(() => BookEntity, (books) => books.owner)
  books: BookEntity[];

  @OneToMany(() => OrderItemsEntity, (orders) => orders.owner)
  orders: OrderItemsEntity[];
}
