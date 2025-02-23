import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookmarksModule } from './bookmarks/bookmarks.module';

@Module({
  imports: [BookmarksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
