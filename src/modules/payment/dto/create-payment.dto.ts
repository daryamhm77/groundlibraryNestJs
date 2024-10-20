import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentDto {
  @ApiProperty()
  addressId: number;
  @ApiPropertyOptional()
  description?: string;
}

export class PaymentDataDto {
  @ApiProperty()
  amount: number;
  @ApiProperty()
  invoice_number: string;
  @ApiProperty()
  orderId: number;
  @ApiProperty()
  status: boolean;
  @ApiProperty()
  userId: number;
}
