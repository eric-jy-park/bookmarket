import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({
    description: 'The URL of the bookmark',
    example: 'https://github.com',
    required: true,
  })
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'The title of the bookmark',
    example: 'GitHub',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'A description of the bookmark',
    example: 'GitHub is where people build software',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "The URL of the bookmark's favicon",
    example: 'https://github.com/favicon.ico',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  faviconUrl?: string;

  @ApiProperty({
    description: 'The category name for the bookmark',
    example: 'Development',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;
}
