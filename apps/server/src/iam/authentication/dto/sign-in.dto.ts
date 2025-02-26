import { IsEmail, IsStrongPassword, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @IsStrongPassword()
  password: string;
}
