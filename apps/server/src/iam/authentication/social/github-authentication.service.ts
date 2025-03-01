import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuthProvider } from 'src/users/enums/auth-provider.enum';
import { AuthenticationService } from '../authentication.service';
import { pgUniqueViolationErrorCode } from 'src/common/constants/error-code';
import { OAuthTokenDto } from '../dto/oauth-token.dto';

@Injectable()
export class GithubAuthenticationService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async authenticate(oauthTokenDto: OAuthTokenDto) {
    console.log(oauthTokenDto);
    try {
      let user = await this.usersRepository.findOneBy({
        github_id: oauthTokenDto.id,
      });

      if (!user) {
        user = await this.usersRepository.save({
          email: oauthTokenDto.email,
          github_id: oauthTokenDto.id,
          auth_provider: AuthProvider.GITHUB,
        });
      }

      return await this.authenticationService.generateTokens(user);
    } catch (error) {
      console.log(error);
      if (error.code === pgUniqueViolationErrorCode) {
        throw new ConflictException('User already exists');
      }
      throw new UnauthorizedException('Invalid token', error);
    }
  }
}
