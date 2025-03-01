import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class OAuthTokenDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsUrl()
  @IsOptional()
  picture?: string;
}
