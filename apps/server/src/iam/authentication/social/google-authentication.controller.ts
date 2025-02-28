import { Controller, Post, Body, Res } from '@nestjs/common';
import { GoogleAuthenticationService } from './google-authentication.service';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
import { GoogleTokenDto } from '../dto/google-token.dto';
import { Response } from 'express';

@Controller('authentication/google')
@Auth(AuthType.None)
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post()
  authenticate(
    @Body() googleTokenDto: GoogleTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.googleAuthenticationService.authenticate(
      googleTokenDto,
      response,
    );
  }
}
