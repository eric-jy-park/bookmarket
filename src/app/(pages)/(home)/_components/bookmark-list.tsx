import Image from "next/image";
import Link from "next/link";
import { type getBookmarks } from "~/server/queries/bookmark";

export function BookmarkList({
  bookmarks,
}: {
  bookmarks: Awaited<ReturnType<typeof getBookmarks>>;
}) {
  return (
    <div className="flex flex-col gap-2">
      {bookmarks.map((bookmark) => (
        <Link
          target="_blank"
          key={bookmark.id}
          href={bookmark.url}
          className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-muted"
        >
          {bookmark.faviconUrl ? (
            <Image
              src={bookmark.faviconUrl}
              alt={bookmark.title}
              width={16}
              height={16}
            />
          ) : (
            <div className="h-4 w-4 bg-muted" />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium">{bookmark.title}</span>
            <span className="text-sm text-muted-foreground">
              {bookmark.description}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
