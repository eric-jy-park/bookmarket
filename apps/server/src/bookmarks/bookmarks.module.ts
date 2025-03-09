import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/iam/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { Bookmark } from './entities/bookmark.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  controllers: [BookmarksController],
  providers: [BookmarksService],
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    TypeOrmModule.forFeature([Bookmark, Category]),
  ],
  exports: [BookmarksService],
})
export class BookmarksModule {}
