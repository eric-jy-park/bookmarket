import { useMutation } from '@tanstack/react-query';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Logo } from '~/app/_common/components/logo';
import { type Bookmark } from '~/app/_common/interfaces/bookmark.interface';
import { cn } from '~/app/_core/utils/cn';
import { fixBrokenFavicon } from '../_actions/fix-broken-favicon.action';
import { BookmarkCardTitleInput } from './bookmark-card-title-input';
import { BookmarkContextMenu, BookmarkContextMenuProvider, BookmarkContextMenuTrigger } from './bookmark-context-menu';
import { BookmarkContextMenuDrawer } from './bookmark-context-menu-drawer';

const MotionLink = motion(Link);

interface BookmarkCardProps {
  bookmark: Bookmark;
  isActive: boolean;
  isBlurred: boolean;
  isViewOnly: boolean;
}

export const BookmarkCard = ({ bookmark, isActive, isBlurred, isViewOnly }: BookmarkCardProps) => {
  const router = useRouter();
  const [isLongPressing, setIsLongPressing] = React.useState(false);
  const longPressTimer = React.useRef<number | null>(null);
  const longPressStartTime = React.useRef<number>(0);
  const animationControls = useAnimation();
  const [tapStartPosition, setTapStartPosition] = React.useState({
    x: 0,
    y: 0,
  });

  const { mutate } = useMutation({
    mutationFn: () => fixBrokenFavicon({ id: bookmark.id }),
    onSuccess: () => {
      setTimeout(() => {
        router.refresh();
      }, 3000);
    },
  });

  // FIXME: This is a hack to migrate the favicon url to the new provider
  React.useEffect(() => {
    if (!bookmark.faviconUrl || bookmark.faviconUrl.startsWith('https://icon.horse')) {
      mutate();
    }
  }, [bookmark.faviconUrl, mutate]);

  const handleCardClick = React.useCallback(() => {
    if (isActive || isBlurred) return;
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  }, [bookmark.url, isActive, isBlurred]);

  const startLongPress = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (isActive) return;
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
    [animationControls, isActive],
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
        handleCardClick();
        animationControls.start({
          scale: 1,
          transition: { duration: 0.2 },
        });
      }
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, [animationControls, handleCardClick]);

  if (isViewOnly) {
    return <ViewOnlyBookmarkCard bookmark={bookmark} />;
  }

  return (
    <>
      {/* Desktop */}
      <span className='hidden sm:block'>
        <BookmarkContextMenuProvider>
          <BookmarkContextMenuTrigger>
            <motion.div
              onClick={handleCardClick}
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
                <Logo className='h-4 w-4 shrink-0' includeText={false} isLink={false} />
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
          <Logo className='h-4 w-4 shrink-0' includeText={false} isLink={false} />
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

const ViewOnlyBookmarkCard = React.memo(({ bookmark }: { bookmark: Bookmark }) => {
  const animationControls = useAnimation();
  return (
    <MotionLink
      href={bookmark.url}
      target='_blank'
      key={bookmark.id}
      className={cn('flex w-full cursor-pointer items-center gap-3 rounded-md p-2 transition-all hover:bg-muted')}
      animate={animationControls}
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
        <Logo className='h-4 w-4 shrink-0' includeText={false} isLink={false} />
      )}
      <div className='flex min-w-0 flex-1 flex-col'>
        <p className='truncate text-sm font-medium'>{bookmark.title ?? ''}</p>
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
    </MotionLink>
  );
});

ViewOnlyBookmarkCard.displayName = 'ViewOnlyBookmarkCard';
