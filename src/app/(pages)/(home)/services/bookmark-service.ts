import ky from "ky";
import {
  type createBookmark as createBookmarkServer,
  type getBookmarks,
} from "~/server/queries/bookmark";

class BookmarkService {
  async createBookmark(bookmark: Parameters<typeof createBookmarkServer>[0]) {
    return ky.post("/api/bookmarks", { json: bookmark }).json();
  }

  async getBookmarks(): Promise<ReturnType<typeof getBookmarks>> {
    return ky.get("/api/bookmarks").json();
  }

  async deleteBookmark(id: number) {
    return ky.delete(`/api/bookmarks`, { json: { id } }).json();
  }
}

export const bookmarkService = new BookmarkService();
