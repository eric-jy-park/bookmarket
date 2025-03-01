import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AuthProvider } from '../enums/auth-provider.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(AuthProvider)
  @IsNotEmpty()
  auth_provider: AuthProvider;

  @IsString()
  @IsOptional()
  github_id?: string;

  @IsString()
  @IsOptional()
  google_id?: string;

  @IsString()
  @IsOptional()
  picture?: string;
}
