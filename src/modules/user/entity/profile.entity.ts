import { EntityNames } from 'src/common/enum/entity.enum';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity(EntityNames.Profile)
export class ProfileEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nick_name: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  genres: string;

  @Column()
  userId: number;

  @Column({ nullable: true })
  address: string
  
  @OneToOne(() => UserEntity, (user) => user.profile, { onDelete: 'CASCADE' })
  user: UserEntity;
}
