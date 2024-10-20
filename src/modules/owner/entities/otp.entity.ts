import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OwnerEntity } from './owner.entity';
import { EntityNames } from 'src/common/enum/entity.enum';

@Entity(EntityNames.OwnerOtp)
export class OwnerOtpEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  code: string;

  @Column()
  expires_in: Date;

  @Column()
  ownerId: number;
  
  @OneToOne(() => OwnerEntity, (owner) => owner.otp, {
    onDelete: 'CASCADE',
  })
  owner: OwnerEntity;
}
