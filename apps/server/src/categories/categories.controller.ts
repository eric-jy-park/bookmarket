import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Category } from './entities/category.entity';

@Controller('categories')
@Auth(AuthType.Cookie)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @ActiveUser() user: User,
  ) {
    return this.categoriesService.create(user.id, createCategoryDto);
  }

  @Get()
  findAll(@ActiveUser() user: User) {
    return this.categoriesService.findAll(user.id);
  }

  @Patch(':id')
  update(
    @ActiveUser() user: User,
    @Param('id') id: Category['id'],
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(user.id, id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@ActiveUser() user: User, @Param('id') id: Category['id']) {
    return this.categoriesService.remove(user.id, id);
  }
}
