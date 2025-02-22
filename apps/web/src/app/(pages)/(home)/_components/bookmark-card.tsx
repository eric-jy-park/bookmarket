import Image from "next/image";
import { LinkPreview } from "~/app/_core/components/link-preview";
import { motion } from "framer-motion";
import {
  BookmarkContextMenu,
  BookmarkContextMenuProvider,
  BookmarkContextMenuTrigger,
} from "./bookmark-context-menu";
import { type Bookmark } from "~/types/bookmark";
import { cn } from "~/app/_core/utils/cn";
import React from "react";
import { BookmarkCardTitleInput } from "./bookmark-card-title-input";

interface BookmarkCardProps {
  bookmark: Bookmark;
  isActive: boolean;
  isBlurred: boolean;
}

export const BookmarkCard = ({
  bookmark,
  isActive,
  isBlurred,
}: BookmarkCardProps) => {
  return (
    <BookmarkContextMenuProvider>
      <BookmarkContextMenuTrigger>
        <LinkPreview url={bookmark.url} isDisabled={isActive || isBlurred}>
          <motion.div
            key={bookmark.id}
            className={cn(
              "flex w-full cursor-pointer items-center gap-3 rounded-md p-2 transition-all hover:bg-muted",
              isActive && "bg-muted",
              isBlurred && "pointer-events-none blur-sm",
            )}
            animate={{
              scale: isActive ? 1.05 : 1,
            }}
            transition={{
              duration: 0.05,
              ease: "linear",
            }}
          >
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
              {isActive ? (
                <BookmarkCardTitleInput bookmark={bookmark} />
              ) : (
                <span className="truncate text-sm font-medium">
                  {bookmark.title}
                </span>
              )}
              <span className="truncate text-xs text-muted-foreground">
                {new URL(bookmark.url).hostname.replace("www.", "")}
              </span>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {new Date(bookmark.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </motion.div>
        </LinkPreview>
      </BookmarkContextMenuTrigger>
      <BookmarkContextMenu bookmark={bookmark} />
    </BookmarkContextMenuProvider>
  );
};
