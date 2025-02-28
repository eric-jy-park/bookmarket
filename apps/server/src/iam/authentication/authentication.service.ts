import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';
import { pgUniqueViolationErrorCode } from 'src/common/constants/error-code';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthProvider } from 'src/users/enums/auth-provider.enum';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = new User();
      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);
      user.auth_provider = AuthProvider.EMAIL;

      return await this.usersRepository.save(user);
    } catch (err) {
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async signIn(signInDto: SignInDto, response: Response) {
    const user = await this.usersRepository.findOneBy({
      email: signInDto.email,
      auth_provider: AuthProvider.EMAIL,
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordCorrect = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Incorrect credentials provided');
    }

    const tokens = await this.generateTokens(user);

    // split into separate function and reuse it
    response.cookie('access_token', tokens.accessToken, {
      secure: true,
      httpOnly: true,
      path: '/',
      expires: new Date(
        Date.now() +
          Number(this.configService.getOrThrow('JWT_ACCESS_TOKEN_TTL')) * 1000,
      ),
    });
    response.cookie('refresh_token', tokens.refreshToken, {
      secure: true,
      httpOnly: true,
      path: '/',
      expires: new Date(
        Date.now() +
          Number(this.configService.getOrThrow('JWT_REFRESH_TOKEN_TTL')) * 1000,
      ),
    });

    return tokens;
  }

  async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(user.id, this.jwtConfiguration.accessTokenTtl, {
        email: user.email,
      }),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto, response: Response) {
    try {
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
      );

      const user = await this.usersRepository.findOneByOrFail({
        id: sub,
      });

      const tokens = await this.generateTokens(user);

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
      throw new UnauthorizedException('Invalid refresh token', error);
    }
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
