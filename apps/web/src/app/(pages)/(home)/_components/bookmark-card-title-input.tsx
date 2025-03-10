"use client";

import React from "react";

import { type Bookmark } from "~/app/_common/interfaces/bookmark.interface";
import { toast } from "sonner";
import { useBookmarkStore } from "../_state/store/use-bookmark-store";
import { updateBookmark } from "~/app/_common/actions/bookmark.action";
import { useRouter } from "next/navigation";

export const BookmarkCardTitleInput = ({
  bookmark,
}: {
  bookmark: Bookmark;
}) => {
  const router = useRouter();
  const [inputValue, setInputValue] = React.useState(bookmark.title);
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

    toast.promise(
      updateBookmark({
        ...bookmark,
        category: bookmark.category?.name,
        title: inputValue,
      }),
      {
        loading: "Updating bookmark...",
        success: "Bookmark updated!",
        error: "Failed to update bookmark",
        finally: () => {
          setActiveBookmarkId(null);
          router.refresh();
        },
      },
    );
  };

  return (
    <form onSubmit={handleUpdateBookmark}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full bg-transparent text-sm font-medium text-foreground/50 focus-visible:outline-none"
      />
    </form>
  );
};
