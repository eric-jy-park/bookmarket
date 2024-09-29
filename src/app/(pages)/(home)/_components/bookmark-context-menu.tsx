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

export const BookmarkContextMenu = ({ bookmark }: { bookmark: Bookmark }) => {
  const { handleDelete } = useBookmarkDelete();
  const { handleCopy } = useBookmarkCopy();
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
        console.log("Rename");
      },
      disabled: true,
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
  const handleAuxClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("aux click");
    },
    [],
  );

  const handleBlur = React.useCallback(() => {
    console.log("blur");
  }, []);

  return (
    <ContextMenuTrigger onAuxClick={handleAuxClick} onBlur={handleBlur}>
      {children}
    </ContextMenuTrigger>
  );
}
