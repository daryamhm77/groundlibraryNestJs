import { PartialType } from '@nestjs/swagger';
import { PaymentDto } from './create-payment.dto';

export class UpdatePaymentDto extends PartialType(PaymentDto) {}
