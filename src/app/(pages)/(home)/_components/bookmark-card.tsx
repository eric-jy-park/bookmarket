import { type getBookmarks } from "~/server/queries/bookmark";
import { BookmarkDeleteButton } from "./bookmark-delete-button";
import Image from "next/image";
import { LinkPreview } from "~/app/_core/components/link-preview";

export const BookmarkCard = ({
  bookmark,
}: {
  bookmark: Awaited<ReturnType<typeof getBookmarks>>[number];
}) => {
  return (
    <LinkPreview url={bookmark.url}>
      <div className="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted">
        {bookmark.faviconUrl ? (
          <Image
            src={bookmark.faviconUrl}
            alt={bookmark.title}
            width={16}
            height={16}
            className="overflow-hidden"
          />
        ) : (
          <div className="h-4 w-4 bg-muted" />
        )}
        <div className="flex flex-1 flex-col">
          <span className="break-all text-sm font-medium">
            {bookmark.title}
          </span>
          <span className="break-words text-sm text-muted-foreground">
            {bookmark.description}
          </span>
        </div>
        <BookmarkDeleteButton id={bookmark.id} />
      </div>
    </LinkPreview>
  );
};
