import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthProvider } from 'src/users/enums/auth-provider.enum';
import { AuthenticationService } from '../authentication.service';
import { pgUniqueViolationErrorCode } from 'src/common/constants/error-code';
import { OAuthTokenDto } from '../dto/oauth-token.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GithubAuthenticationService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  async authenticate(oauthTokenDto: OAuthTokenDto) {
    try {
      let user = await this.usersService.findOne(
        oauthTokenDto.email,
        AuthProvider.GITHUB,
      );

      if (!user) {
        user = await this.usersService.create({
          email: oauthTokenDto.email,
          github_id: oauthTokenDto.id,
          auth_provider: AuthProvider.GITHUB,
          picture: oauthTokenDto.picture,
        });
      }

      return await this.authenticationService.generateTokens(user);
    } catch (error) {
      if (error.code === pgUniqueViolationErrorCode) {
        throw new ConflictException('User already exists');
      }
      throw new UnauthorizedException('Invalid token', error);
    }
  }
}
