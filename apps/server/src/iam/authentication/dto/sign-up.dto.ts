import { IsEmail, IsStrongPassword, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @IsStrongPassword()
  password: string;
}
