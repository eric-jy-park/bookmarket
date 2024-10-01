import { useMutation } from "@tanstack/react-query";
import { type createBookmark } from "~/server/queries/bookmark";
import { bookmarkService } from "../../services/bookmark-service";
import { useQueryClient } from "@tanstack/react-query";
import { bookmarksQueries } from "../queries/bookmark-query";

export const useCreateBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookmark: Parameters<typeof createBookmark>[0]) =>
      bookmarkService.createBookmark(bookmark),
    onSuccess: async () => {
      await queryClient.invalidateQueries(bookmarksQueries.bookmarks());
    },
  });
};
