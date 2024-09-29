import Image from "next/image";
import { LinkPreview } from "~/app/_core/components/link-preview";
import {
  BookmarkContextMenu,
  BookmarkContextMenuProvider,
  BookmarkContextMenuTrigger,
} from "./bookmark-context-menu";
import { type Bookmark } from "~/types/bookmark";

export const BookmarkCard = ({ bookmark }: { bookmark: Bookmark }) => {
  return (
    <BookmarkContextMenuProvider>
      <BookmarkContextMenuTrigger>
        <LinkPreview url={bookmark.url}>
          <div className="flex w-full cursor-pointer items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted">
            {bookmark.faviconUrl ? (
              <Image
                src={bookmark.faviconUrl}
                alt={bookmark.title}
                width={16}
                height={16}
                className="shrink-0 overflow-hidden"
              />
            ) : (
              <div className="h-4 w-4 shrink-0 bg-muted" />
            )}
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">
                {bookmark.title}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {new URL(bookmark.url).hostname.replace("www.", "")}
              </span>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {new Date(bookmark.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </LinkPreview>
      </BookmarkContextMenuTrigger>
      <BookmarkContextMenu bookmark={bookmark} />
    </BookmarkContextMenuProvider>
  );
};
