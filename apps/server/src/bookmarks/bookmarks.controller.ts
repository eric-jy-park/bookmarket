import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  CurrentUser,
  User,
} from 'src/common/decorators/current-user.decorator';

@Controller('bookmarks')
@UseGuards(AuthGuard)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  async getAllBookmarks(@CurrentUser() user: User) {
    return this.bookmarksService.getAllBookmarks(user.id);
  }

  @Post()
  async createBookmark(@Body() createBookmarkDto: any) {
    return this.bookmarksService.createBookmark(createBookmarkDto);
  }

  @Patch('/:id')
  async patchBookmark(@Param('id') id: string, @Body() patchBookmarkDto: any) {
    return this.bookmarksService.patchBookmark(id, patchBookmarkDto);
  }

  @Delete('/:id')
  async deleteBookmark(@Param('id') id: string) {
    return this.bookmarksService.deleteBookmark(id);
  }
}
