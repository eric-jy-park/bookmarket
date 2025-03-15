import { useBookmarkDelete } from './use-bookmark-delete';

import { CopyIcon, TrashIcon } from 'lucide-react';

import { PencilIcon } from 'lucide-react';
import React from 'react';
import { type Bookmark } from '~/app/_common/interfaces/bookmark.interface';
import { useBookmarkStore } from '../_state/store/use-bookmark-store';
import { useBookmarkCopy } from './use-bookmark-copy';
export const useBookmarkContext = ({ bookmark }: { bookmark: Bookmark }) => {
  const { handleDelete } = useBookmarkDelete();
  const { handleCopy } = useBookmarkCopy();

  const { setActiveBookmarkId, activeBookmarkId } = useBookmarkStore();

  const menuItems = React.useMemo(
    () => [
      {
        icon: CopyIcon,
        label: 'Copy',
        onClick: () => {
          void handleCopy(bookmark.url);
        },
        disabled: false,
      },
      {
        icon: PencilIcon,
        label: 'Rename',
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
        label: 'Delete',
        onClick: () => {
          void handleDelete(bookmark.id);
        },
        disabled: false,
      },
    ],
    [activeBookmarkId, bookmark.id, bookmark.url, handleCopy, handleDelete, setActiveBookmarkId],
  );

  return { menuItems };
};
