import {
  createBookmark as createBookmarkServer,
  getBookmarks as getBookmarksServer,
  updateBookmark as updateBookmarkServer,
  deleteBookmark as deleteBookmarkServer,
} from "~/server/queries/bookmark";

class BookmarkService {
  async createBookmark(bookmark: Parameters<typeof createBookmarkServer>[0]) {
    return createBookmarkServer(bookmark);
  }

  async getBookmarks(): Promise<ReturnType<typeof getBookmarksServer>> {
    return getBookmarksServer();
  }

  async updateBookmark(bookmark: Parameters<typeof updateBookmarkServer>[0]) {
    return updateBookmarkServer(bookmark);
  }

  async deleteBookmark(id: string) {
    return deleteBookmarkServer({ id });
  }
}

export const bookmarkService = new BookmarkService();
