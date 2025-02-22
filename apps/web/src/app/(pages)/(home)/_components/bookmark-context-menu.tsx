"use client";

import { CopyIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/app/_core/components/context-menu";
import { useBookmarkDelete } from "../_hooks/use-bookmark-delete";
import React from "react";
import { useBookmarkCopy } from "../_hooks/use-bookmark-copy";
import { type Bookmark } from "~/types/bookmark";
import { useBookmarkStore } from "../_state/store/use-bookmark-store";

export const BookmarkContextMenu = ({ bookmark }: { bookmark: Bookmark }) => {
  const { handleDelete } = useBookmarkDelete();
  const { handleCopy } = useBookmarkCopy();

  const { setActiveBookmarkId, activeBookmarkId } = useBookmarkStore();

  const menuItems = [
    {
      icon: CopyIcon,
      label: "Copy",
      onClick: async () => {
        await handleCopy(bookmark.url);
      },
      disabled: false,
    },
    {
      icon: PencilIcon,
      label: "Rename",
      onClick: () => {
        if (activeBookmarkId !== bookmark.id) {
          setActiveBookmarkId(bookmark.id);
        } else {
          setActiveBookmarkId(null);
        }
      },
      disabled: false,
    },
    {
      icon: TrashIcon,
      label: "Delete",
      onClick: async () => {
        await handleDelete(bookmark.id);
      },
      disabled: false,
    },
  ];

  return (
    <ContextMenuContent>
      {menuItems.map((item) => (
        <ContextMenuItem
          key={item.label}
          className="cursor-pointer font-medium text-muted-foreground"
          onClick={item.onClick}
          disabled={item.disabled}
        >
          <item.icon className="mr-3 h-4 w-4" />
          {item.label}
        </ContextMenuItem>
      ))}
    </ContextMenuContent>
  );
};

export const BookmarkContextMenuProvider = ContextMenu;

export function BookmarkContextMenuTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContextMenuTrigger>{children}</ContextMenuTrigger>;
}
