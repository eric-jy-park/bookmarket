import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/iam/config/jwt.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [BookmarksController],
  providers: [BookmarksService],
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
})
export class BookmarksModule {}
