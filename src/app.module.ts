import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerModule } from './modules/owner/owner.module';
import { LibrariesModule } from './modules/libraries/libraries.module';
import { BooksModule } from './modules/books/books.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { UserModule } from './modules/user/user.module';
import { BasketModule } from './modules/basket/basket.module';
import { AddressModule } from './modules/user/address/address.module';
import { HttpApiModule } from './modules/http/http.module';
import { AuthModule } from './modules/auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'doriskick',
      database: 'ground-lib',
      autoLoadEntities: false,
      synchronize: false,
      entities: [
        'dist/**/**/**/*.entity{.ts,.js}',
        'dist/**/**/*.entity{.ts,.js}',
      ],
    }),
    UserModule,
    OwnerModule,
    LibrariesModule,
    BooksModule,
    OrderModule,
    PaymentModule,
    BasketModule,
    AddressModule,
    HttpApiModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
