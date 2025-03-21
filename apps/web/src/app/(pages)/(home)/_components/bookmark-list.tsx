'use client';

import BlurFade from '~/app/_core/components/blur-fade';
import { useBookmarkStore } from '../_state/store/use-bookmark-store';
import { BookmarkCard } from './bookmark-card';

import { parseAsString, useQueryState } from 'nuqs';
import React from 'react';
import { useBodyScrollLock } from '~/app/_common/hooks/use-body-scroll-lock';
import { type Bookmark } from '~/app/_common/interfaces/bookmark.interface';

export function BookmarkList({ bookmarks, isViewOnly }: { bookmarks: Bookmark[]; isViewOnly: boolean }) {
  const { activeBookmarkId } = useBookmarkStore();
  useBodyScrollLock({ isDisabled: activeBookmarkId === null });
  const [category] = useQueryState('c', parseAsString);

  const filteredBookmarks = React.useMemo(
    () =>
      bookmarks.filter(bookmark => {
        if (!category) return true;
        return bookmark.category?.name === category;
      }),
    [bookmarks, category],
  );

  return (
    <div className='relative flex flex-col gap-2'>
      {filteredBookmarks?.map((bookmark, index) => (
        <BlurFade key={bookmark.id} duration={0.2} delay={0.05 + index * 0.025}>
          <BookmarkCard
            bookmark={bookmark}
            isActive={activeBookmarkId === bookmark.id}
            isBlurred={activeBookmarkId !== null && activeBookmarkId !== bookmark.id}
            isViewOnly={isViewOnly}
          />
        </BlurFade>
      ))}
    </div>
  );
}
