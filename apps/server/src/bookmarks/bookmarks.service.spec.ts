import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthProvider } from 'src/users/enums/auth-provider.enum';
import { UsersService } from 'src/users/users.service';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { Bookmark } from './entities/bookmark.entity';

const currentTime = new Date();

const mockUser: User = {
  id: '111111-1111-1111-111111',
  email: 'test@test.com',
  username: 'test',
  firstName: 'test',
  lastName: 'test',
  password: 'test',
  isPublic: false,
  auth_provider: AuthProvider.EMAIL,
  bookmarks: [],
  categories: [],
};

const mockCategory: Category = {
  id: '111111-1111-1111-111111',
  bookmarks: [],
  name: 'mockCategory',
  user: mockUser,
  createdAt: currentTime,
  updatedAt: currentTime,
};

const mockBookmark: Bookmark = {
  id: '111111-1111-1111-111111',
  title: 'This is a bookmark',
  url: 'www.naver.com',
  createdAt: currentTime,
  updatedAt: currentTime,
  description: 'Description',
  faviconUrl: 'www.naver.com/favicon.ico',
  user: mockUser,
  category: mockCategory,
};

const mockBookmarksRepository = { findOne: jest.fn(), find: jest.fn(), save: jest.fn() };

const mockCategoriesService = { findOneByName: jest.fn() };

describe('BookmarksService', () => {
  let bookmarksService: BookmarksService;
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarksService,
        {
          provide: getRepositoryToken(Bookmark),
          useValue: mockBookmarksRepository,
        },
        // For now, we'll use empty mocks for the other services since findOneBookmark doesn't use them
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    bookmarksService = module.get<BookmarksService>(BookmarksService);
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  describe('findOneBookmark', () => {
    it('should return a bookmark if found', async () => {
      mockBookmarksRepository.findOne.mockResolvedValue(mockBookmark);

      const foundBookmark = await bookmarksService.findOneBookmark(mockUser.id, mockBookmark.id);

      expect(foundBookmark).toEqual(mockBookmark);
    });

    it('should throw a NotFoundException if bookmark not found', async () => {
      mockBookmarksRepository.findOne.mockResolvedValue(null);

      await expect(bookmarksService.findOneBookmark('nouserid', 'nobookmarkid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllBookmarks', () => {
    it('should return all bookmarks', async () => {
      const mockBookmarks = [mockBookmark];
      mockBookmarksRepository.find.mockResolvedValue(mockBookmarks);

      const bookmarks = await bookmarksService.findAllBookmarks(mockUser.id);

      expect(bookmarks).toEqual(mockBookmarks);
    });

    it('should return all bookmarks of a specific category', async () => {
      const mockBookmarks = [mockBookmark];
      mockBookmarksRepository.find.mockResolvedValue(mockBookmarks);

      const bookmarks = await bookmarksService.findAllBookmarks(mockUser.id, mockCategory.name);

      expect(bookmarks).toEqual(mockBookmarks);
    });

    it('should return an empty list of bookmarks', async () => {
      const mockBookmarks: Bookmark[] = [];
      mockBookmarksRepository.find.mockResolvedValue(mockBookmarks);

      const bookmarks = await bookmarksService.findAllBookmarks('fake-user-id', 'fake-category-name');

      expect(bookmarks).toEqual(mockBookmarks);
    });
  });

  describe('createBookmark', () => {
    const mockBookmarkDto: CreateBookmarkDto = {
      url: 'www.test.com',
      description: 'test',
      faviconUrl: 'www.test.com',
      title: 'test',
    };

    const mockCreatedBookmark: Bookmark = {
      id: '111111-1111-1111-111111',
      title: 'test',
      url: 'www.test.com',
      createdAt: currentTime,
      updatedAt: currentTime,
      description: 'test',
      faviconUrl: 'www.test.com',
      user: mockUser,
    };

    it('should create a bookmark without a category', async () => {
      const expectedSaveInput = {
        ...mockBookmarkDto,
        user: { id: mockUser.id },
      };

      mockBookmarksRepository.save.mockResolvedValue(mockCreatedBookmark);

      const createdBookmark = await bookmarksService.createBookmark(mockBookmarkDto, mockUser.id);

      expect(createdBookmark).toEqual(mockCreatedBookmark);
      expect(mockBookmarksRepository.save).toHaveBeenCalledWith(expectedSaveInput);
      expect(categoriesService.findOneByName).not.toHaveBeenCalled();
    });

    it('should create a bookmark with a category', async () => {
      const mockBookmarkDtoWithCategory: CreateBookmarkDto = {
        ...mockBookmarkDto,
        category: mockCategory.name,
      };
      const mockCreatedBookmarkWithCategory: Bookmark = {
        ...mockCreatedBookmark,
        category: mockCategory,
      };

      const expectedSaveInput = {
        ...mockBookmarkDtoWithCategory,
        category: mockCategory,
        user: { id: mockUser.id },
      };

      mockCategoriesService.findOneByName.mockResolvedValue(mockCategory);
      mockBookmarksRepository.save.mockResolvedValue(mockCreatedBookmarkWithCategory);

      const createdBookmark = await bookmarksService.createBookmark(mockBookmarkDtoWithCategory, mockUser.id);

      expect(createdBookmark).toEqual(mockCreatedBookmarkWithCategory);
      expect(mockBookmarksRepository.save).toHaveBeenCalledWith(expectedSaveInput);
      expect(categoriesService.findOneByName).toHaveBeenCalledWith(mockCategory.name, mockUser.id);
    });

    it('should fail to create a bookmark with a non-existent category', async () => {
      const mockBookmarkDtoWithCategory: CreateBookmarkDto = {
        ...mockBookmarkDto,
        category: mockCategory.name,
      };

      mockCategoriesService.findOneByName.mockResolvedValue(null);

      await expect(bookmarksService.createBookmark(mockBookmarkDtoWithCategory, mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCategoriesService.findOneByName).toHaveBeenCalledWith(mockCategory.name, mockUser.id);
      expect(mockBookmarksRepository.save).not.toHaveBeenCalled();
    });
  });
});
