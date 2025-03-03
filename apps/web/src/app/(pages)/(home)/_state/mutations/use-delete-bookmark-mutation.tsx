import { useMutation } from "@tanstack/react-query";
import { bookmarkService } from "../../services/bookmark-service";

import { useRouter } from "next/navigation";

export const useDeleteBookmarkMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (id: string) => bookmarkService.deleteBookmark(id),
    onSuccess: async () => {
      router.refresh();
    },
  });
};
