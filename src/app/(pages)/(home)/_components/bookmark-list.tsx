"use client";

import { BookmarkCard } from "./bookmark-card";
import BlurFade from "~/app/_core/components/blur-fade";
import { useBookmarkStore } from "../_state/store/use-bookmark-store";

import { bookmarksQueries } from "../_state/queries/bookmark-query";
import { useQuery } from "@tanstack/react-query";

export function BookmarkList() {
  const { activeBookmarkId } = useBookmarkStore();

  const { data: bookmarks } = useQuery(bookmarksQueries.bookmarks());

  return (
    <div className="flex flex-col gap-2">
      {bookmarks?.map((bookmark, index) => (
        <BlurFade key={bookmark.id} duration={0.2} delay={0.2 + index * 0.05}>
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
