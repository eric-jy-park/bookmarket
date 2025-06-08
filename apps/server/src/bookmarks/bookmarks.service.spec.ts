import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { User } from 'src/users/entities/user.entity';
import { AuthProvider } from 'src/users/enums/auth-provider.enum';
import { UsersService } from 'src/users/users.service';
import { BookmarksService } from './bookmarks.service';
import { Bookmark } from './entities/bookmark.entity';

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

const currentTime = new Date();

const mockBookmark: Bookmark = {
  id: '111111-1111-1111-111111',
  title: 'This is a bookmark',
  url: 'www.naver.com',
  user: mockUser,
  createdAt: currentTime,
  updatedAt: currentTime,
  description: 'Description',
  faviconUrl: 'www.naver.com/favicon.ico',
};

const mockBookmarksRepository = { findOne: jest.fn() };

describe('BookmarksService', () => {
  let service: BookmarksService;

  beforeEach(async () => {
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
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<BookmarksService>(BookmarksService);
  });

  describe('findOneBookmark', () => {
    it('should return a bookmark if found', async () => {
      mockBookmarksRepository.findOne.mockResolvedValue(mockBookmark);

      const foundBookmark = await service.findOneBookmark(mockUser.id, mockBookmark.id);

      expect(foundBookmark).toEqual(mockBookmark);
    });

    it('should throw a NotFoundException if bookmark not found', async () => {
      mockBookmarksRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneBookmark('nouserid', 'nobookmarkid')).rejects.toThrow(NotFoundException);
    });
  });
});
