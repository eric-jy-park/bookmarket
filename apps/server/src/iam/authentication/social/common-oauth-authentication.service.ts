import { Injectable } from '@nestjs/common';
import { randomAlphaStringGenerator } from 'src/common/utils/random-alpha-string-generator';
import { USERNAME_MAX_LENGTH } from 'src/iam/constants/username';
import { AuthProvider } from 'src/users/enums/auth-provider.enum';
import { UsersService } from 'src/users/users.service';
import { AuthenticationService } from '../authentication.service';
import { OAuthTokenDto } from '../dto/oauth-token.dto';

@Injectable()
export class CommonOAuthService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  async authenticate(oauthTokenDto: OAuthTokenDto, authProvider: AuthProvider) {
    let user = await this.usersService.findOne(oauthTokenDto.email, authProvider);

    if (!user) {
      user = await this.usersService.create({
        email: oauthTokenDto.email,
        github_id: oauthTokenDto.id,
        picture: oauthTokenDto.picture,
        firstName: oauthTokenDto.firstName ?? 'Bookmarket',
        lastName: oauthTokenDto.lastName ?? 'User',
        username: randomAlphaStringGenerator(USERNAME_MAX_LENGTH),
        auth_provider: authProvider,
      });
    }

    const missingUserInfo: Record<string, string> = {};

    if (!user.firstName) {
      missingUserInfo.firstName = oauthTokenDto.firstName ?? 'Bookmarket';
    }
    if (!user.lastName) {
      missingUserInfo.lastName = oauthTokenDto.lastName ?? 'user';
    }
    if (!user.username) {
      missingUserInfo.username = randomAlphaStringGenerator(USERNAME_MAX_LENGTH);
    }

    if (Object.keys(missingUserInfo).length > 0) {
      await this.usersService.updateUser(user.id, missingUserInfo);
    }

    return this.authenticationService.generateTokens(user);
  }
}
