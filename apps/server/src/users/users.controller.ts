import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  async findMe(@ActiveUser('id') userId: string) {
    const user = await this.usersService.findOneById(userId);

    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      email: user.email,
      picture: user.picture,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Get('check-username')
  async checkIsUsernameAvailable(@ActiveUser('id') id: User['id'], @Query('username') username: string) {
    const isAvailable = await this.usersService.checkIsUsernameAvailable(id, username);
    return { isAvailable };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
