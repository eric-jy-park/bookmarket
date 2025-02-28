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
import { Response } from 'express';

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

  async authenticate(googleTokenDto: GoogleTokenDto, response: Response) {
    try {
      const user = await this.usersRepository.findOneBy({
        google_id: googleTokenDto.googleId,
      });

      let tokens: { accessToken: string; refreshToken: string };

      if (user) {
        tokens = await this.authenticationService.generateTokens(user);
      } else {
        const newUser = await this.usersRepository.save({
          email: googleTokenDto.email,
          google_id: googleTokenDto.googleId,
          auth_provider: AuthProvider.GOOGLE,
        });

        tokens = await this.authenticationService.generateTokens(newUser);
      }

      response.cookie('access_token', tokens.accessToken, {
        secure: true,
        httpOnly: true,
        path: '/',
        expires: new Date(
          Date.now() +
            Number(this.configService.getOrThrow('JWT_ACCESS_TOKEN_TTL')) *
              1000,
        ),
      });
      response.cookie('refresh_token', tokens.refreshToken, {
        secure: true,
        httpOnly: true,
        path: '/',
        expires: new Date(
          Date.now() +
            Number(this.configService.getOrThrow('JWT_REFRESH_TOKEN_TTL')) *
              1000,
        ),
      });

      return tokens;
    } catch (error) {
      console.log(error);
      if (error.code === pgUniqueViolationErrorCode) {
        throw new ConflictException('User already exists');
      }
      throw new UnauthorizedException('Invalid token', error);
    }
  }
}
