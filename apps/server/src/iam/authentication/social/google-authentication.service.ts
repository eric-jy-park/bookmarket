import { Injectable } from '@nestjs/common';
import { AuthProvider } from 'src/users/enums/auth-provider.enum';
import { AuthenticationService } from '../authentication.service';
import { OAuthTokenDto } from '../dto/oauth-token.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleAuthenticationService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  async authenticate(oauthTokenDto: OAuthTokenDto) {
    let user = await this.usersService.findOne(
      oauthTokenDto.email,
      AuthProvider.GOOGLE,
    );

    if (!user) {
      user = await this.usersService.create({
        email: oauthTokenDto.email,
        google_id: oauthTokenDto.id,
        picture: oauthTokenDto.picture,
        auth_provider: AuthProvider.GOOGLE,
      });
    }

    return await this.authenticationService.generateTokens(user);
  }
}
