import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Injectable()
export class BookmarksService {
  createBookmark(createBookmarkDto: CreateBookmarkDto) {
    return 'This action adds a new bookmark';
  }

  findAllBookmarks() {
    return `This action returns all bookmarks`;
  }

  findOneBookmark(id: number) {
    return `This action returns a #${id} bookmark`;
  }

  updateBookmark(id: number, updateBookmarkDto: UpdateBookmarkDto) {
    return `This action updates a #${id} bookmark`;
  }

  removeBookmark(id: number) {
    return `This action removes a #${id} bookmark`;
  }
}
