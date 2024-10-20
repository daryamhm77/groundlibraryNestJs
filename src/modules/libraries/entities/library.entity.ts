import { EntityNames } from 'src/common/enum/entity.enum';
import { BookEntity } from 'src/modules/books/entities/book.entity';
import { OwnerEntity } from 'src/modules/owner/entities/owner.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity(EntityNames.Libraries)
export class LibraryEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  genres: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  ownerId: number;

  @Column()
  bookId: number;

  @ManyToOne(() => OwnerEntity, (owner) => owner.library, {
    onDelete: 'CASCADE',
  })
  
  owner: OwnerEntity;
  @OneToMany(() => BookEntity, (book) => book.library, { cascade: true })
  books: BookEntity[];
}
