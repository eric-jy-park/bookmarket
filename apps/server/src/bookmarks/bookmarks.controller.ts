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
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

@Controller('bookmarks')
@Auth(AuthType.Bearer)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  createBookmark(@Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarksService.createBookmark(createBookmarkDto);
  }

  @Get()
  findAllBookmarks(@ActiveUser() user: ActiveUserData) {
    console.log(user.email);
    return this.bookmarksService.findAllBookmarks();
  }

  @Get(':id')
  findOneBookmark(@Param('id') id: string) {
    return this.bookmarksService.findOneBookmark(+id);
  }

  @Patch(':id')
  updateBookmark(
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarksService.updateBookmark(+id, updateBookmarkDto);
  }

  @Delete(':id')
  removeBookmark(@Param('id') id: string) {
    return this.bookmarksService.removeBookmark(+id);
  }
}
