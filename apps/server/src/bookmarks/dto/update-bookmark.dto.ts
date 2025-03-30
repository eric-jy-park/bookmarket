import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';
import { CreateBookmarkDto } from './create-bookmark.dto';

export class UpdateBookmarkDto extends PartialType(CreateBookmarkDto) {
  @ApiProperty({
    description: 'The URL of the bookmark',
    example: 'https://github.com/features',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  url?: string;
}
