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

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = new User();
      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);

      await this.usersRepository.save(user);
    } catch (err) {
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOneBy({
      email: signInDto.email,
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

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );

    return {
      accessToken,
    };
  }
}
