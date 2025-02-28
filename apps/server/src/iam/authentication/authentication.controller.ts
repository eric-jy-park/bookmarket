import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Response } from 'express';

@Controller('authentication')
@Auth(AuthType.None)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authenticationService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(signInDto);
    return this.authenticationService.signIn(signInDto, response);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authenticationService.refreshToken(refreshTokenDto, response);
  }
}
