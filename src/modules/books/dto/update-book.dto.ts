import { PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';
import { IsOptional, IsInt, Min } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsOptional()
  @IsInt()
  @Min(0)
  libraryId?: number;
}
