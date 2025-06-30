'use client';

import '~/styles/raycast.scss';

import { useQuery } from '@tanstack/react-query';
import { FolderIcon, PlusIcon, SettingsIcon } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import React from 'react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from 'cmdk';
import { useAppState } from '~/app/(pages)/(home)/home/_state/store/use-app-state-store';
import { cn } from '~/app/_core/utils/cn';
import { getMe } from '../actions/user.action';
import { modalIds } from '../constants/modal-id.constants';
import { bookmarksQuery } from '../state/query/bookmark.query';
import { categoriesQuery } from '../state/query/category.query';
import { Logo } from './logo';
import UserSettingsDialog from './user-settings-dialog';

const INITIAL_BOOKMARK_LIMIT = 8;

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [, setCategory] = useQueryState('c', parseAsString);
  const { openModal, closeModal } = useAppState();

  const { data: bookmarks } = useQuery(bookmarksQuery());
  const { data: categories } = useQuery(categoriesQuery());
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getMe,
  });

  const displayedBookmarks = React.useMemo(() => {
    if (!bookmarks) return [];

    if (search.trim()) {
      return bookmarks.filter(
        bookmark =>
          (bookmark.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
          bookmark.url.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return bookmarks.slice(0, INITIAL_BOOKMARK_LIMIT);
  }, [bookmarks, search]);

  const openSettings = React.useCallback(() => {
    if (user) {
      openModal({
        id: modalIds.userSettings,
        content: (
          <UserSettingsDialog onCloseClick={() => closeModal({ id: modalIds.userSettings })} initialUser={user} />
        ),
      });
      setOpen(false);
    }
  }, [closeModal, openModal, user]);

  const openAddCategory = React.useCallback(() => {
    const addCategoryButton = document.querySelector('[data-add-category-trigger]') as HTMLElement;
    if (addCategoryButton) {
      addCategoryButton.click();
      setOpen(false);
    }
  }, []);

  const handleCategorySelect = React.useCallback(
    (categoryName: string) => {
      setCategory(categoryName);
      setOpen(false);
    },
    [setCategory],
  );

  const handleBookmarkOpen = React.useCallback((url: string) => {
    window.open(url, '_blank');
    setOpen(false);
  }, []);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  React.useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  return (
    <>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className={cn(
          'cmdk-root raycast fixed left-1/2 top-1/2 z-50 w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background shadow-lg',
        )}
      >
        <CommandInput
          placeholder='Search for a bookmark...'
          value={search}
          onValueChange={setSearch}
          className='border-b py-2'
        />
        <CommandList className='pt-2'>
          <CommandEmpty>No results found.</CommandEmpty>

          {displayedBookmarks && displayedBookmarks.length > 0 && (
            <>
              <CommandGroup heading={search.trim() ? 'Search Results' : 'Recent Bookmarks'}>
                {displayedBookmarks.map(bookmark => (
                  <CommandItem
                    key={bookmark.id}
                    value={`bookmark-${bookmark.id}-${bookmark.title || bookmark.url}`}
                    onSelect={() => handleBookmarkOpen(bookmark.url)}
                  >
                    {bookmark.faviconUrl ? (
                      <img src={bookmark.faviconUrl} alt={bookmark.title} className={cn('mr-2 h-4 w-4')} />
                    ) : (
                      <Logo includeText={false} isLink={false} className={cn('mr-2 h-4 w-4')} />
                    )}
                    <span className={cn('truncate text-sm')}>{bookmark.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          <CommandSeparator />

          {categories && categories.length > 0 && (
            <>
              <CommandGroup heading='Categories'>
                {categories.map(category => (
                  <CommandItem
                    key={category.id}
                    value={`category-${category.id}-${category.name}`}
                    onSelect={() => handleCategorySelect(category.name)}
                  >
                    <FolderIcon className={cn('mr-2 h-4 w-4')} />
                    <span>{category.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />

          <CommandGroup heading='Actions'>
            {categories && categories.length <= 5 && (
              <CommandItem value='action-add-category' onSelect={openAddCategory}>
                <PlusIcon className={cn('mr-2 h-4 w-4')} />
                <span>Add Category</span>
              </CommandItem>
            )}
            {user && (
              <CommandItem value='action-settings' onSelect={openSettings}>
                <SettingsIcon className={cn('mr-2 h-4 w-4')} />
                <span>Settings</span>
              </CommandItem>
            )}
          </CommandGroup>
        </CommandList>

        {/* Footer */}
        <div cmdk-raycast-footer=''>
          <Logo includeText={false} isLink={false} className={cn('h-5 w-5')} />
          <hr />
          <i className='w-full text-right text-xs text-muted-foreground'>All your bookmarks in one place</i>
        </div>
      </CommandDialog>

      {open && <div className={cn('fixed inset-0 z-50 size-full bg-black/50')} />}
    </>
  );
}
