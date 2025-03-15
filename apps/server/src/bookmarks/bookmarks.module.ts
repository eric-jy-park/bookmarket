import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/iam/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from 'src/categories/categories.module';
import { Category } from 'src/categories/entities/category.entity';
import { BookmarksController } from './bookmarks.controller';
import { Bookmark } from './entities/bookmark.entity';
import { BookmarksService } from './bookmarks.service';

@Module({
  controllers: [BookmarksController],
  providers: [BookmarksService],
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    TypeOrmModule.forFeature([Bookmark, Category]),
    CategoriesModule,
  ],
  exports: [BookmarksService],
})
export class BookmarksModule {}
