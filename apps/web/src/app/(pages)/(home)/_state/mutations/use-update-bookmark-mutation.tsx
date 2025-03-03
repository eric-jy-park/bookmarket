import { useMutation } from "@tanstack/react-query";
import { type updateBookmark } from "~/app/_common/actions/bookmark.action";
import { bookmarkService } from "../../services/bookmark-service";
import { useRouter } from "next/navigation";
import { bookmarksQueries } from "../queries/bookmark-query";

export const updateBookmarkMutationKey = "updateBookmark";

export const useUpdateBookmarkMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (bookmark: Parameters<typeof updateBookmark>[0]) =>
      bookmarkService.updateBookmark(bookmark),
    onSuccess: async () => {
      router.refresh();
    },
    mutationKey: [updateBookmarkMutationKey],
  });
};
