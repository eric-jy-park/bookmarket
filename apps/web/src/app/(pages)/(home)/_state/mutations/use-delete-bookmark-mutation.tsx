import { useMutation } from "@tanstack/react-query";
import { bookmarkService } from "../../services/bookmark-service";
import { bookmarksQueries } from "../queries/bookmark-query";
import { getQueryClient } from "~/app/_core/utils/get-query-client";
import { useRouter } from "next/navigation";

export const useDeleteBookmarkMutation = () => {
  const queryClient = getQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (id: number) => bookmarkService.deleteBookmark(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries(bookmarksQueries.bookmarks());
      router.refresh();
    },
  });
};
