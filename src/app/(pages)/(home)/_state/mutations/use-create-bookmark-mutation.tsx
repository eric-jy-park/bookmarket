import { useMutation } from "@tanstack/react-query";
import { type createBookmark } from "~/server/queries/bookmark";
import { bookmarkService } from "../../services/bookmark-service";

export const useCreateBookmarkMutation = () => {
  return useMutation({
    mutationFn: (bookmark: Parameters<typeof createBookmark>[0]) =>
      bookmarkService.createBookmark(bookmark),
  });
};
