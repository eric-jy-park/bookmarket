import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { Category } from 'src/categories/entities/category.entity';

@Controller('bookmarks')
@Auth(AuthType.Cookie)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  createBookmark(
    @ActiveUser('id') userId: string,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarksService.createBookmark(createBookmarkDto, userId);
  }

  @Get()
  findAllBookmarks(
    @ActiveUser('id') userId: string,
    @Param('category') categoryName?: Category['name'],
  ) {
    return this.bookmarksService.findAllBookmarks(userId, categoryName);
  }

  @Get(':id')
  findOneBookmark(@ActiveUser('id') userId: string, @Param('id') id: string) {
    return this.bookmarksService.findOneBookmark(userId, id);
  }

  @Patch(':id')
  updateBookmark(
    @ActiveUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarksService.updateBookmark(userId, id, updateBookmarkDto);
  }

  @Patch(':id/category')
  updateBookmarkCategory(
    @ActiveUser('id') userId: string,
    @Param('id') id: string,
    @Body('categoryId') categoryId: string,
  ) {
    return this.bookmarksService.updateBookmarkCategory(userId, id, categoryId);
  }

  @Delete(':id')
  removeBookmark(@ActiveUser('id') userId: string, @Param('id') id: string) {
    return this.bookmarksService.removeBookmark(userId, id);
  }
}
