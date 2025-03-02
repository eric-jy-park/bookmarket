import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBookmarkDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsUrl()
  faviconUrl: string;
}
