import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuthProvider } from 'src/users/enums/auth-provider.enum';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { AuthenticationService } from '../authentication.service';
import { pgUniqueViolationErrorCode } from 'src/common/constants/error-code';
import { GoogleTokenDto } from '../dto/google-token.dto';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;
  constructor(
    private readonly configService: ConfigService,
    private readonly authenticationService: AuthenticationService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    const clientId = this.configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');

    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      let user = await this.usersRepository.findOneBy({
        google_id: googleTokenDto.googleId,
      });

      if (!user) {
        user = await this.usersRepository.save({
          email: googleTokenDto.email,
          google_id: googleTokenDto.googleId,
          auth_provider: AuthProvider.GOOGLE,
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
