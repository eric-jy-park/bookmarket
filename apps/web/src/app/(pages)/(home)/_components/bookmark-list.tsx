"use client";

import { BookmarkCard } from "./bookmark-card";
import BlurFade from "~/app/_core/components/blur-fade";
import { useBookmarkStore } from "../_state/store/use-bookmark-store";

import { type Bookmark } from "~/app/_common/interfaces/bookmark.interface";
import { useBodyScrollLock } from "~/app/_common/hooks/use-body-scroll-lock";
import { useQueryState, parseAsString } from "nuqs";
import React from "react";

export function BookmarkList({ bookmarks }: { bookmarks: Bookmark[] }) {
  const { activeBookmarkId } = useBookmarkStore();
  useBodyScrollLock({ isDisabled: activeBookmarkId === null });
  const [category] = useQueryState("c", parseAsString);

  const filteredBookmarks = React.useMemo(
    () =>
      bookmarks.filter((bookmark) => {
        if (!category) return true;
        return bookmark.category?.name === category;
      }),
    [bookmarks, category],
  );

  return (
    <div className="relative flex flex-col gap-2">
      {filteredBookmarks?.map((bookmark, index) => (
        <BlurFade key={bookmark.id} duration={0.2} delay={0.05 + index * 0.025}>
          <BookmarkCard
            bookmark={bookmark}
            isActive={activeBookmarkId === bookmark.id}
            isBlurred={
              activeBookmarkId !== null && activeBookmarkId !== bookmark.id
            }
          />
        </BlurFade>
      ))}
    </div>
  );
}
