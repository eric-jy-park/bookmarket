import { useMutation } from "@tanstack/react-query";
import { type updateBookmark } from "~/server/queries/bookmark";
import { bookmarkService } from "../../services/bookmark-service";

export const useUpdateBookmarkMutation = () => {
  return useMutation({
    mutationFn: (bookmark: Parameters<typeof updateBookmark>[0]) =>
      bookmarkService.updateBookmark(bookmark.id, bookmark),
  });
};
