import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class GoogleTokenDto {
  @IsString()
  @IsNotEmpty()
  googleId: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsUrl()
  @IsOptional()
  picture?: string;
}
