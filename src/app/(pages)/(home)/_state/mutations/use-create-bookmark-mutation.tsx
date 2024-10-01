import { useMutation } from "@tanstack/react-query";
import { type createBookmark } from "~/server/queries/bookmark";
import { bookmarkService } from "../../services/bookmark-service";
import { bookmarksQueries } from "../queries/bookmark-query";
import { getQueryClient } from "~/app/_core/utils/get-query-client";

export const useCreateBookmarkMutation = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (bookmark: Parameters<typeof createBookmark>[0]) =>
      bookmarkService.createBookmark(bookmark),
    onSuccess: async () => {
      await queryClient.invalidateQueries(bookmarksQueries.bookmarks());
    },
  });
};
