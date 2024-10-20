import { EntityNames } from 'src/common/enum/entity.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../enum/userType.enum';
import { OtpEntity } from './otp.entity';
import { Roles } from 'src/common/enum/role.enum';
import { ProfileEntity } from './profile.entity';
import { BasketEntity } from 'src/modules/basket/entity/basket.entity';
import { AddressEntity } from '../address/entities/address.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { PaymentEntity } from 'src/modules/payment/entities/payment.entity';

@Entity(EntityNames.User)
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column()
  fullName: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.User })
  role: Roles;

  @Column({ nullable: true })
  otpId: number;

  @Column({ nullable: true })
  profileId: number;

  @Column({ nullable: true })
  verify_email: boolean;

  @Column({ nullable: true })
  new_email: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => OtpEntity, (otp) => otp.user, { nullable: true })
  @JoinColumn()
  otp: OtpEntity;

  @OneToOne(() => ProfileEntity, (profile) => profile.user)
  profile: ProfileEntity;

  @OneToMany(() => BasketEntity, (basket) => basket.user)
  basket: BasketEntity[];

  @OneToMany(() => AddressEntity, (address) => address.user)
  address: AddressEntity[];

  @OneToMany(() => OrderEntity, (orders) => orders.user)
  orders: OrderEntity[];

  @OneToMany(() => PaymentEntity, (payments) => payments.user)
  payments: PaymentEntity[];
}
