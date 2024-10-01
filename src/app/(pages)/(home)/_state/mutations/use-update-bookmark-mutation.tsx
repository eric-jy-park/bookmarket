import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type updateBookmark } from "~/server/queries/bookmark";
import { bookmarkService } from "../../services/bookmark-service";

import { bookmarksQueries } from "../queries/bookmark-query";

export const updateBookmarkMutationKey = "updateBookmark";

export const useUpdateBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookmark: Parameters<typeof updateBookmark>[0]) =>
      bookmarkService.updateBookmark(bookmark.id, bookmark),
    onSuccess: async () => {
      await queryClient.invalidateQueries(bookmarksQueries.bookmarks());
    },
    mutationKey: [updateBookmarkMutationKey],
  });
};
