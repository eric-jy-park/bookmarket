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
import { Category } from 'src/categories/entities/category.entity';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarksRepository: Repository<Bookmark>,
    private categoriesService: CategoriesService,
  ) {}

  async createBookmark(createBookmarkDto: CreateBookmarkDto, userId: string) {
    const category = await this.categoriesService.findOneByName(
      createBookmarkDto.category,
      userId,
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.bookmarksRepository.save({
      ...createBookmarkDto,
      category,
      user: { id: userId },
    });
  }

  findAllBookmarks(userId: string, categoryName?: Category['name']) {
    return this.bookmarksRepository.find({
      where: {
        user: { id: userId },
        category: {
          name: categoryName,
        },
      },
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
      category: { id: updateBookmarkDto.category ?? bookmark.category?.id },
    });
  }

  async updateBookmarkCategory(
    userId: string,
    id: string,
    categoryId?: string,
  ) {
    const bookmark = await this.findOneBookmark(userId, id);
    if (bookmark.user.id !== userId) {
      throw new ForbiddenException();
    }

    if (categoryId) {
      const category = await this.categoriesService.findOne(categoryId);

      if (category.user.id !== userId) {
        throw new ForbiddenException();
      }
    }

    return this.bookmarksRepository.update(id, {
      category: categoryId ? { id: categoryId } : null,
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
