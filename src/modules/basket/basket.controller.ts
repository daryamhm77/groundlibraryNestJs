import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { SwaggerConsumes } from 'src/common/enum/swagger-consumes.enum';
import { BasketDto } from './dto/basket.dto';
import { BasketService } from './basket.service';

@Controller('Basket')
@ApiTags('Basket')
@AuthDecorator()
export class BasketController {
  constructor(private readonly basketService: BasketService) {}
  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  addToBasket(@Body() basketDto: BasketDto) {
    return this.basketService.addToBasket(basketDto);
  }
  @Get()
  getBasket() {
    return this.basketService.getBasket();
  }
}
