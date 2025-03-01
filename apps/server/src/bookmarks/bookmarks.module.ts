import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/iam/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { Bookmark } from './entities/bookmark.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [BookmarksController],
  providers: [BookmarksService],
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    TypeOrmModule.forFeature([Bookmark]),
  ],
  exports: [BookmarksService],
})
export class BookmarksModule {}
