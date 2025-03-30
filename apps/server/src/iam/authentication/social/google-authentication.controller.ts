import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { OAuthTokenDto } from '../dto/oauth-token.dto';
import { AuthType } from '../enums/auth-type.enum';
import { GoogleAuthenticationService } from './google-authentication.service';

@ApiTags('GoogleAuthentication')
@Auth(AuthType.None)
@Controller('authentication/google')
export class GoogleAuthenticationController {
  constructor(private readonly googleAuthService: GoogleAuthenticationService) {}

  @Post()
  @ApiOperation({
    summary: 'Google authentication',
    description: 'Authenticate user with Google OAuth token',
  })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  authenticate(@Body() tokenData: OAuthTokenDto) {
    return this.googleAuthService.authenticate(tokenData);
  }
}
