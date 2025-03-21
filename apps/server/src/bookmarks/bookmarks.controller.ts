import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Category } from 'src/categories/entities/category.entity';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @Auth(AuthType.Cookie)
  createBookmark(@ActiveUser('id') userId: string, @Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarksService.createBookmark(createBookmarkDto, userId);
  }

  @Get()
  @Auth(AuthType.Cookie)
  findAllBookmarks(@ActiveUser('id') userId: string, @Query('category') categoryName?: Category['name']) {
    return this.bookmarksService.findAllBookmarks(userId, categoryName);
  }

  @Get('/s/:username')
  @Auth(AuthType.None)
  findAllBookmarksByUsername(
    @Param('username') username: User['username'],
    @Query('category') categoryName?: Category['name'],
  ) {
    return this.bookmarksService.findAllBookmarksByUsername(username, categoryName);
  }

  @Get(':id')
  @Auth(AuthType.Cookie)
  findOneBookmark(@ActiveUser('id') userId: string, @Param('id') id: string) {
    return this.bookmarksService.findOneBookmark(userId, id);
  }

  @Patch(':id')
  @Auth(AuthType.Cookie)
  updateBookmark(
    @ActiveUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarksService.updateBookmark(userId, id, updateBookmarkDto);
  }

  @Patch(':id/category')
  @Auth(AuthType.Cookie)
  updateBookmarkCategory(
    @ActiveUser('id') userId: string,
    @Param('id') id: string,
    @Body('categoryId') categoryId: string,
  ) {
    return this.bookmarksService.updateBookmarkCategory(userId, id, categoryId);
  }

  @Delete(':id')
  @Auth(AuthType.Cookie)
  removeBookmark(@ActiveUser('id') userId: string, @Param('id') id: string) {
    return this.bookmarksService.removeBookmark(userId, id);
  }
}
