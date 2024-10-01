import { useMutation } from "@tanstack/react-query";
import { bookmarkService } from "../../services/bookmark-service";
import { useQueryClient } from "@tanstack/react-query";
import { bookmarksQueries } from "../queries/bookmark-query";

export const useDeleteBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bookmarkService.deleteBookmark(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries(bookmarksQueries.bookmarks());
    },
  });
};
