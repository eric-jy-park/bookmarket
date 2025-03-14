import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthProvider } from './enums/auth-provider.enum';
import { pgUniqueViolationErrorCode } from 'src/common/constants/error-code';

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
    } catch (err) {
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException('User already exists');
      }
      throw err;
    }
  }

  findOne(email: string, auth_provider: AuthProvider) {
    return this.usersRepository.findOneBy({ email, auth_provider });
  }

  findOneById(id: string) {
    return this.usersRepository.findOneBy({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.usersRepository.delete(id);
  }
}
