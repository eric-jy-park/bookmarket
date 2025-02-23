import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { BookmarkSchema } from './schema';
import { desc, eq } from 'drizzle-orm';

@Injectable()
export class BookmarksService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase,
  ) {}

  async getAllBookmarks(userId: string) {
    return this.database
      .select()
      .from(BookmarkSchema)
      .where(eq(BookmarkSchema.userId, userId))
      .orderBy(desc(BookmarkSchema.createdAt));
  }

  async createBookmark(createBookmarkDto: any) {
    return {};
  }

  async patchBookmark(id: string, patchBookmarkDto: any) {}

  async deleteBookmark(id: string) {}
}
