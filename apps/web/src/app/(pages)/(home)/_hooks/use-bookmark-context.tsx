import { useBookmarkDelete } from "./use-bookmark-delete";

import { CopyIcon, TrashIcon } from "lucide-react";

import { PencilIcon } from "lucide-react";
import { useBookmarkCopy } from "./use-bookmark-copy";
import { useBookmarkStore } from "../_state/store/use-bookmark-store";
import { Bookmark } from "~/app/_common/interfaces/bookmark.interface";
import React from "react";
export const useBookmarkContext = ({ bookmark }: { bookmark: Bookmark }) => {
  const { handleDelete } = useBookmarkDelete();
  const { handleCopy } = useBookmarkCopy();

  const { setActiveBookmarkId, activeBookmarkId } = useBookmarkStore();

  const menuItems = React.useMemo(
    () => [
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
    ],
    [
      activeBookmarkId,
      bookmark.id,
      handleCopy,
      handleDelete,
      setActiveBookmarkId,
    ],
  );

  return { menuItems };
};
