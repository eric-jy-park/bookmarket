import { PartialType } from '@nestjs/mapped-types';
import { CreateBookmarkDto } from './create-bookmark.dto';
import { IsOptional, IsUrl } from 'class-validator';

export class UpdateBookmarkDto extends PartialType(CreateBookmarkDto) {
  @IsOptional()
  @IsUrl()
  url?: string;
}
