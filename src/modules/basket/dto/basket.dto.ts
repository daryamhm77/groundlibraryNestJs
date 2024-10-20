import { ApiProperty } from '@nestjs/swagger';

export class BasketDto {
  @ApiProperty()
  bookId: number;
}
