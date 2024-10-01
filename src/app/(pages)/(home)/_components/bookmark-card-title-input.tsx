"use client";

import React from "react";
import { useBookmarkUpdate } from "../_hooks/use-bookmark-update";
import { type Bookmark } from "~/types/bookmark";
import { toast } from "sonner";
import { useBookmarkStore } from "../_state/store/use-bookmark-store";

export const BookmarkCardTitleInput = ({
  bookmark,
}: {
  bookmark: Bookmark;
}) => {
  const [inputValue, setInputValue] = React.useState(bookmark.title);
  const { updateBookmark, isPending } = useBookmarkUpdate();
  const { setActiveBookmarkId } = useBookmarkStore();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleUpdateBookmark = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue === bookmark.title) {
      setActiveBookmarkId(null);
      return;
    }

    toast.promise(updateBookmark({ ...bookmark, title: inputValue }), {
      loading: "Updating bookmark...",
      success: "Bookmark updated!",
      error: "Failed to update bookmark",
      finally: () => {
        setActiveBookmarkId(null);
      },
    });
  };

  return (
    <form onSubmit={handleUpdateBookmark}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full bg-transparent text-sm font-medium text-foreground/50 focus-visible:outline-none"
        disabled={isPending}
      />
    </form>
  );
};
