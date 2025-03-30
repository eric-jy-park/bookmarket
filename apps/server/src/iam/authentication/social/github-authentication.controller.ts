import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { OAuthTokenDto } from '../dto/oauth-token.dto';
import { AuthType } from '../enums/auth-type.enum';
import { GithubAuthenticationService } from './github-authentication.service';

@ApiTags('GithubAuthentication')
@Auth(AuthType.None)
@Controller('authentication/github')
export class GithubAuthenticationController {
  constructor(private readonly githubAuthService: GithubAuthenticationService) {}

  @Post()
  @ApiOperation({
    summary: 'GitHub authentication',
    description: 'Authenticate user with GitHub OAuth token',
  })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  authenticate(@Body() tokenData: OAuthTokenDto) {
    return this.githubAuthService.authenticate(tokenData);
  }
}
