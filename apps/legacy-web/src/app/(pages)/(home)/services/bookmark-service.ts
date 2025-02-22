import ky from "ky";
import {
  type createBookmark as createBookmarkServer,
  type getBookmarks,
  type updateBookmark as updateBookmarkServer,
} from "~/server/queries/bookmark";

class BookmarkService {
  async createBookmark(bookmark: Parameters<typeof createBookmarkServer>[0]) {
    return ky.post("/api/bookmarks", { json: bookmark }).json();
  }

  async getBookmarks(): Promise<ReturnType<typeof getBookmarks>> {
    return ky.get("/api/bookmarks").json();
  }

  async updateBookmark(
    id: number,
    bookmark: Parameters<typeof updateBookmarkServer>[0],
  ) {
    return ky.patch(`/api/bookmarks/${id}`, { json: bookmark }).json();
  }

  async deleteBookmark(id: number) {
    return ky.delete(`/api/bookmarks`, { json: { id } }).json();
  }
}

export const bookmarkService = new BookmarkService();
