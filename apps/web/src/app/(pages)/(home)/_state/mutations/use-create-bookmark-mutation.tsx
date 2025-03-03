import { useMutation } from "@tanstack/react-query";
import { type createBookmark } from "~/app/_common/actions/bookmark.action";
import { bookmarkService } from "../../services/bookmark-service";
import { useRouter } from "next/navigation";

export const useCreateBookmarkMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (bookmark: Parameters<typeof createBookmark>[0]) =>
      bookmarkService.createBookmark(bookmark),
    onSuccess: async () => {
      router.refresh();
    },
  });
};
