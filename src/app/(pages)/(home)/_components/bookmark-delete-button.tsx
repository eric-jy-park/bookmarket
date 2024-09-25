"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useDeleteBookmarkMutation } from "../_state/mutations/use-delete-bookmark-mutation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function BookmarkDeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const { mutateAsync, isPending } = useDeleteBookmarkMutation();

  const handleDelete = async (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await mutateAsync(id);
      toast.success("Bookmark deleted successfully");
    } catch {
      toast.error("Failed to delete bookmark");
    } finally {
      router.refresh();
    }
  };

  if (isPending) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  return (
    <Trash2
      className="h-4 w-4 shrink-0 text-muted-foreground transition-colors hover:text-destructive"
      onClick={handleDelete}
    />
  );
}
