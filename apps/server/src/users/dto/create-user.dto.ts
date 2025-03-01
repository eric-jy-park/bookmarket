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
  @IsNotEmpty()
  password: string;

  @IsEnum(AuthProvider)
  @IsNotEmpty()
  auth_provider: AuthProvider;

  @IsString()
  @IsOptional()
  picture?: string;
}
