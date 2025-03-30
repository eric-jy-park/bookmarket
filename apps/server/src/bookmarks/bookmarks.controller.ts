import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from 'src/categories/entities/category.entity';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@ApiTags('Bookmarks')
@Controller('bookmarks')
@ApiCookieAuth('access_token')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @Auth(AuthType.Cookie)
  @ApiOperation({ summary: 'Create a new bookmark', description: 'Creates a new bookmark for the authenticated user' })
  @ApiResponse({ status: 201, description: 'Bookmark created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createBookmark(@ActiveUser('id') userId: string, @Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarksService.createBookmark(createBookmarkDto, userId);
  }

  @Get()
  @Auth(AuthType.Cookie)
  @ApiOperation({ summary: 'Get all bookmarks', description: 'Retrieves all bookmarks for the authenticated user' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter bookmarks by category name' })
  @ApiResponse({ status: 200, description: 'Bookmarks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllBookmarks(@ActiveUser('id') userId: string, @Query('category') categoryName?: Category['name']) {
    return this.bookmarksService.findAllBookmarks(userId, categoryName);
  }

  @Get('/s/:username')
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Get all bookmarks by username',
    description: 'Retrieves all public bookmarks for a specific user by their username',
  })
  @ApiParam({ name: 'username', description: 'Username of the user whose bookmarks to retrieve' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter bookmarks by category name' })
  @ApiResponse({ status: 200, description: 'Bookmarks retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findAllBookmarksByUsername(
    @Param('username') username: User['username'],
    @Query('category') categoryName?: Category['name'],
  ) {
    return this.bookmarksService.findAllBookmarksByUsername(username, categoryName);
  }

  @Get(':id')
  @Auth(AuthType.Cookie)
  @ApiOperation({ summary: 'Get a bookmark by ID', description: 'Retrieves a specific bookmark by its ID' })
  @ApiParam({ name: 'id', description: 'ID of the bookmark to retrieve' })
  @ApiResponse({ status: 200, description: 'Bookmark retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bookmark not found' })
  findOneBookmark(@ActiveUser('id') userId: string, @Param('id') id: string) {
    return this.bookmarksService.findOneBookmark(userId, id);
  }

  @Patch(':id')
  @Auth(AuthType.Cookie)
  @ApiOperation({ summary: 'Update a bookmark', description: 'Updates a specific bookmark by its ID' })
  @ApiParam({ name: 'id', description: 'ID of the bookmark to update' })
  @ApiResponse({ status: 200, description: 'Bookmark updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bookmark not found' })
  updateBookmark(
    @ActiveUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarksService.updateBookmark(userId, id, updateBookmarkDto);
  }

  @Patch(':id/category')
  @Auth(AuthType.Cookie)
  @ApiOperation({
    summary: 'Update bookmark category',
    description: 'Updates the category of a specific bookmark',
  })
  @ApiParam({ name: 'id', description: 'ID of the bookmark to update' })
  @ApiResponse({ status: 200, description: 'Bookmark category updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid category ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bookmark or category not found' })
  updateBookmarkCategory(
    @ActiveUser('id') userId: string,
    @Param('id') id: string,
    @Body('categoryId') categoryId: string,
  ) {
    return this.bookmarksService.updateBookmarkCategory(userId, id, categoryId);
  }

  @Delete(':id')
  @Auth(AuthType.Cookie)
  @ApiOperation({ summary: 'Delete a bookmark', description: 'Deletes a specific bookmark by its ID' })
  @ApiParam({ name: 'id', description: 'ID of the bookmark to delete' })
  @ApiResponse({ status: 200, description: 'Bookmark deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bookmark not found' })
  removeBookmark(@ActiveUser('id') userId: string, @Param('id') id: string) {
    return this.bookmarksService.removeBookmark(userId, id);
  }
}
