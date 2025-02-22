import { queryOptions } from "@tanstack/react-query";
import { bookmarkService } from "../../services/bookmark-service";

const bookmarksQueryKey = "bookmarks";

export const bookmarksQueries = {
  bookmarks: () =>
    queryOptions({
      queryKey: [bookmarksQueryKey],
      queryFn: async () => await bookmarkService.getBookmarks(),
    }),
};
