import { Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { ClerkClientService } from 'src/common/services/clerk-client.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BookmarksController],
  providers: [BookmarksService, ClerkClientService],
})
export class BookmarksModule {}
