import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  createBookmark(createBookmarkDto: CreateBookmarkDto, userId: string) {
    return this.bookmarksRepository.save({
      ...createBookmarkDto,
      user: { id: userId },
    });
  }

  findAllBookmarks(userId: string) {
    return this.bookmarksRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneBookmark(userId: string, id: string) {
    const bookmark = await this.bookmarksRepository.findOne({
      where: { user: { id: userId }, id },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    return bookmark;
  }

  async updateBookmark(
    userId: string,
    id: string,
    updateBookmarkDto: UpdateBookmarkDto,
  ) {
    const bookmark = await this.findOneBookmark(userId, id);

    if (bookmark.user.id !== userId) {
      throw new ForbiddenException();
    }

    return this.bookmarksRepository.update(id, {
      ...updateBookmarkDto,
      user: { id: userId },
    });
  }

  async removeBookmark(userId: string, id: string) {
    const bookmark = await this.findOneBookmark(userId, id);

    if (bookmark.user.id !== userId) {
      throw new ForbiddenException();
    }

    return this.bookmarksRepository.delete(id);
  }
}
