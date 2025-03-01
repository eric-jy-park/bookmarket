import { Injectable } from '@nestjs/common';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { Bookmark } from './entities/bookmark.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarksRepository: Repository<Bookmark>,
  ) {}

  createBookmark(createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarksRepository.save(createBookmarkDto);
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
