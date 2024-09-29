import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteBookmarkMutation } from "../_state/mutations/use-delete-bookmark-mutation";
import React from "react";

export const useBookmarkDelete = () => {
  const router = useRouter();
  const { mutateAsync, isPending } = useDeleteBookmarkMutation();

  const handleDelete = React.useCallback(
    async (id: number) => {
      try {
        toast.promise(mutateAsync(id), {
          loading: "Deleting bookmark...",
          success: "Bookmark deleted successfully",
          error: "Failed to delete bookmark",
          finally: () => {
            router.refresh();
          },
        });
      } catch {
        toast.error("Failed to delete bookmark");
      }
    },
    [mutateAsync, router],
  );

  return { handleDelete, isPending };
};
