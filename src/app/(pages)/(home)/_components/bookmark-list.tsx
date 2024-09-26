import { type getBookmarks } from "~/server/queries/bookmark";
import { BookmarkCard } from "./bookmark-card";

export function BookmarkList({
  bookmarks,
}: {
  bookmarks: Awaited<ReturnType<typeof getBookmarks>>;
}) {
  return (
    <div className="flex flex-col gap-2">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
}
