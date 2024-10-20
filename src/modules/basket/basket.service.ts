import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasketEntity } from './entity/basket.entity';
import { Repository } from 'typeorm';
import { BooksService } from '../books/books.service';
import { REQUEST } from '@nestjs/core';
import { BasketDto } from './dto/basket.dto';
import { CustomRequest } from 'src/common/interface/user.interface';
import { OrderService } from '../order/order.service';

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity)
    private basketRepository: Repository<BasketEntity>,
    private bookService: BooksService,
    private orderService: OrderService, 
    @Inject(REQUEST) private req: CustomRequest,
  ) {}

 
  async applyFirstOrderDiscount(userId: number) {
    const userOrders = await this.orderService.findOrdersByUserId(userId);
    if (userOrders.length === 0) {
     
      const discount = 0.5;
      return discount;
    }
    return 0; 
  }

  
  async addToBasket(basketDto: BasketDto) {
    const { id: userId } = this.req.user;
    const { bookId } = basketDto;
    const book = await this.bookService.getOne(bookId);
    if (!book) throw new BadRequestException('Book not found!');

    let basketOfBooks = await this.basketRepository.findOne({
      where: {
        userId,
        bookId,
      },
    });

    if (basketOfBooks) {
      basketOfBooks.count += 1;
    } else {
      basketOfBooks = this.basketRepository.create({
        bookId,
        userId,
        count: 1,
      });
    }

    await this.basketRepository.save(basketOfBooks);
    return {
      message: 'Added book to your basket',
    };
  }

 
  async getBasket() {
    const { id: userId } = this.req.user;
    const basketOfBooks = await this.basketRepository.find({
      where: { userId },
      relations: {
        book: {
          owner: true,
        },
      },
    });

    const books = basketOfBooks.filter((book) => book.bookId);

    let total_amount = 0;
    let payment_amount = 0;
    let total_discount_amount = 0;
    const bookList = [];

   
    const firstOrderDiscount = await this.applyFirstOrderDiscount(userId);

    for (const item of books) {
      let discountAmount = 0;
      const { book, count } = item;
      total_amount += book.price * count;
      let bookPrice = book.price * count;

      if (firstOrderDiscount) {
        discountAmount += bookPrice * firstOrderDiscount;
        bookPrice = bookPrice - bookPrice * firstOrderDiscount;
      }

      payment_amount += bookPrice;
      total_discount_amount += discountAmount;

      bookList.push({
        bookId: book.id,
        name: book.title,
        description: book.description,
        count,
        price: book.price,
        total_amount: book.price * count,
        discount_amount: discountAmount,
        payment_amount: bookPrice,
        ownerId: book.owner?.id,
        ownerName: book.owner?.manager_name,
      });
    }

    return {
      bookList,
      total_amount,
      payment_amount,
      total_discount_amount,
    };
  }
}
