import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Logo } from '~/app/_common/components/logo';
import { type Bookmark } from '~/app/_common/interfaces/bookmark.interface';
import { LinkPreview } from '~/app/_core/components/link-preview';
import { cn } from '~/app/_core/utils/cn';
import { BookmarkCardTitleInput } from './bookmark-card-title-input';
import { BookmarkContextMenu, BookmarkContextMenuProvider, BookmarkContextMenuTrigger } from './bookmark-context-menu';
import { BookmarkContextMenuDrawer } from './bookmark-context-menu-drawer';

interface BookmarkCardProps {
  bookmark: Bookmark;
  isActive: boolean;
  isBlurred: boolean;
}

export const BookmarkCard = ({ bookmark, isActive, isBlurred }: BookmarkCardProps) => {
  const router = useRouter();

  const [isLongPressing, setIsLongPressing] = React.useState(false);
  const longPressTimer = React.useRef<number | null>(null);
  const longPressStartTime = React.useRef<number>(0);
  const animationControls = useAnimation();
  const [tapStartPosition, setTapStartPosition] = React.useState({
    x: 0,
    y: 0,
  });

  const handleClick = React.useCallback(() => {
    router.push(bookmark.url);
  }, [bookmark.url, router]);

  const startLongPress = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      longPressStartTime.current = Date.now();
      setTapStartPosition({ x: e.clientX, y: e.clientY });

      animationControls.start({
        scale: 1.05,
        transition: { duration: 0.5, ease: 'linear' },
      });

      longPressTimer.current = window.setTimeout(() => {
        if (longPressTimer.current) {
          setIsLongPressing(true);
        }
      }, 500);
    },
    [animationControls],
  );

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (longPressTimer.current) {
        const deltaX = e.clientX - tapStartPosition.x;
        const deltaY = e.clientY - tapStartPosition.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > 5) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
          animationControls.start({
            scale: 1,
            transition: { duration: 0.2 },
          });
        }
      }
    },
    [animationControls, tapStartPosition],
  );

  const endLongPress = React.useCallback(() => {
    if (longPressTimer.current) {
      const pressDuration = Date.now() - longPressStartTime.current;
      if (pressDuration < 500) {
        handleClick();
      }
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, [handleClick]);

  return (
    <>
      {/* Desktop */}
      <span className='hidden sm:block'>
        <BookmarkContextMenuProvider>
          <BookmarkContextMenuTrigger>
            <LinkPreview url={bookmark.url} isDisabled={isActive || isBlurred}>
              <motion.div
                key={bookmark.id}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-3 rounded-md p-2 transition-all hover:bg-muted',
                  isActive && 'bg-muted',
                  isBlurred && 'pointer-events-none blur-sm',
                )}
                animate={animationControls}
                initial={{ scale: isActive ? 1.05 : 1 }}
              >
                {bookmark.faviconUrl ? (
                  <Image
                    src={bookmark.faviconUrl}
                    alt={bookmark.title ?? ''}
                    width={16}
                    height={16}
                    className='shrink-0 overflow-hidden'
                    unoptimized={true}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                  />
                ) : (
                  <Logo className='h-4 w-4 shrink-0' includeText={false} />
                )}
                <div className='flex min-w-0 flex-1 flex-col'>
                  {isActive ? (
                    <BookmarkCardTitleInput bookmark={bookmark} />
                  ) : (
                    <p className='truncate text-sm font-medium'>{bookmark.title ?? ''}</p>
                  )}
                  <span className='truncate text-xs text-muted-foreground'>
                    {new URL(bookmark.url).hostname.replace('www.', '')}
                  </span>
                </div>
                <span className='shrink-0 text-xs text-muted-foreground'>
                  {new Date(bookmark.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </motion.div>
            </LinkPreview>
          </BookmarkContextMenuTrigger>
          <BookmarkContextMenu bookmark={bookmark} />
        </BookmarkContextMenuProvider>
      </span>

      {/* Mobile */}
      <motion.div
        key={bookmark.id}
        className={cn(
          'flex w-full cursor-pointer select-none items-center gap-3 rounded-md p-2 transition-all sm:hidden',
          isLongPressing && 'bg-muted',
        )}
        animate={animationControls}
        initial={{ scale: isActive ? 1.05 : 1 }}
        onPointerDown={startLongPress}
        onPointerMove={onPointerMove}
        onPointerUp={endLongPress}
        onPointerLeave={endLongPress}
        onPointerCancel={endLongPress}
      >
        {bookmark.faviconUrl ? (
          <Image
            src={bookmark.faviconUrl}
            alt={bookmark.title ?? ''}
            width={16}
            height={16}
            className='shrink-0 overflow-hidden'
            unoptimized={true}
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        ) : (
          <Logo className='h-4 w-4 shrink-0' includeText={false} />
        )}
        <div className='flex min-w-0 flex-1 flex-col'>
          {isActive ? (
            <BookmarkCardTitleInput bookmark={bookmark} />
          ) : (
            <p className='truncate text-sm font-medium'>{bookmark.title ?? ''}</p>
          )}
          <span className='truncate text-xs text-muted-foreground'>
            {new URL(bookmark.url).hostname.replace('www.', '')}
          </span>
        </div>
        <span className='shrink-0 text-xs text-muted-foreground'>
          {new Date(bookmark.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </motion.div>
      <BookmarkContextMenuDrawer
        bookmark={bookmark}
        isOpen={isLongPressing}
        onClose={() => {
          setIsLongPressing(false);
          animationControls.start({
            scale: isActive ? 1.05 : 1,
            transition: { duration: 0.2 },
          });
          clearTimeout(longPressTimer.current!);
          longPressTimer.current = null;
        }}
      />
    </>
  );
};
