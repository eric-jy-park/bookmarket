import { toast } from "sonner";
import React from "react";
import { deleteBookmark } from "~/app/_common/actions/bookmark.action";
import { useRouter } from "next/navigation";

export const useBookmarkDelete = () => {
  const router = useRouter();
  const handleDelete = React.useCallback(async (id: string) => {
    try {
      toast.promise(deleteBookmark({ id }), {
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
  }, []);

  return { handleDelete };
};
