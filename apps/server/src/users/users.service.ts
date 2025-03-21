import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pgUniqueViolationErrorCode } from 'src/common/constants/error-code';
import { Repository } from 'typeorm';
import { UNALLOWED_USERNAMES } from './constants/invalid-username.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthProvider } from './enums/auth-provider.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersRepository.save(createUserDto);

      return user;
    } catch (err: any) {
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException('User already exists');
      }
      throw err;
    }
  }

  findOne(email: string, authProvider: AuthProvider) {
    return this.usersRepository.findOneBy({
      email,
      auth_provider: authProvider,
    });
  }

  findOneById(id: string) {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByUsername(username: User['username']) {
    return this.usersRepository.findOneBy({
      username,
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  async checkIsUsernameAvailable(userId: string, username: string) {
    const user = await this.findOneById(userId);

    if (!user) throw new NotFoundException('User not found');

    if (UNALLOWED_USERNAMES.includes(username)) throw new ForbiddenException('This username is not allowed');

    if (username) if (user.username === username) return true;

    const usernameCount = await this.usersRepository.count({ where: { username } });

    return usernameCount === 0;
  }

  remove(id: string) {
    return this.usersRepository.delete(id);
  }
}
