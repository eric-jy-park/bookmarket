import { useMutation } from "@tanstack/react-query";
import { bookmarkService } from "../../services/bookmark-service";

export const useDeleteBookmarkMutation = () => {
  return useMutation({
    mutationFn: (id: number) => bookmarkService.deleteBookmark(id),
  });
};
