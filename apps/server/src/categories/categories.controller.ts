import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@ApiTags('Categories')
@Controller('categories')
@ApiCookieAuth('access_token')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Auth(AuthType.Cookie)
  @ApiOperation({
    summary: 'Create a new category',
    description: 'Creates a new bookmark category for the authenticated user',
  })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createCategoryDto: CreateCategoryDto, @ActiveUser() user: User) {
    return this.categoriesService.create(user.id, createCategoryDto);
  }

  @Get()
  @Auth(AuthType.Cookie)
  @ApiOperation({ summary: 'Get all categories', description: 'Retrieves all categories for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@ActiveUser() user: User) {
    return this.categoriesService.findAll(user.id);
  }

  @Patch(':id')
  @Auth(AuthType.Cookie)
  @ApiOperation({ summary: 'Update a category', description: 'Updates a specific category by ID' })
  @ApiParam({ name: 'id', description: 'ID of the category to update' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  update(@ActiveUser() user: User, @Param('id') id: Category['id'], @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(user.id, id, updateCategoryDto);
  }

  @Delete(':id')
  @Auth(AuthType.Cookie)
  @ApiOperation({ summary: 'Delete a category', description: 'Deletes a specific category by ID' })
  @ApiParam({ name: 'id', description: 'ID of the category to delete' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@ActiveUser() user: User, @Param('id') id: Category['id']) {
    return this.categoriesService.remove(user.id, id);
  }

  @Get('/s/:username')
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Get categories by username',
    description: 'Retrieves all public categories for a specific user by their username',
  })
  @ApiParam({ name: 'username', description: 'Username of the user whose categories to retrieve' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findAllByUsername(@Param('username') username: User['username']) {
    return this.categoriesService.findAllByUsername(username);
  }
}
