import { Controller, Post, Body } from '@nestjs/common';
import { GoogleAuthenticationService } from './google-authentication.service';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
import { GoogleTokenDto } from '../dto/google-token.dto';

@Controller('authentication/google')
@Auth(AuthType.None)
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post()
  authenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return this.googleAuthenticationService.authenticate(googleTokenDto);
  }
}
