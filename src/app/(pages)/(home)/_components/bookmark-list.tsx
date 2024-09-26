import { type getBookmarks } from "~/server/queries/bookmark";
import { BookmarkCard } from "./bookmark-card";
import BlurFade from "~/app/_core/components/blur-fade";

export function BookmarkList({
  bookmarks,
}: {
  bookmarks: Awaited<ReturnType<typeof getBookmarks>>;
}) {
  return (
    <div className="flex flex-col gap-2">
      {bookmarks.map((bookmark, index) => (
        <BlurFade key={bookmark.id} duration={0.2} delay={0.2 + index * 0.05}>
          <BookmarkCard bookmark={bookmark} />
        </BlurFade>
      ))}
    </div>
  );
}
