import { PartialType } from '@nestjs/swagger';
import { OwnerSignupDto } from './create-owner.dto';

export class UpdateOwnerDto extends PartialType(OwnerSignupDto) {}
