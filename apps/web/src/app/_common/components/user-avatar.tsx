'use client';

import { LogOutIcon, SettingsIcon, UserRoundIcon } from 'lucide-react';
import React from 'react';
import { type User } from '~/app/(pages)/(auth)/types';
import { useAppState } from '~/app/(pages)/(home)/_state/store/use-app-state-store';
import { Avatar, AvatarFallback, AvatarImage } from '~/app/_core/components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/app/_core/components/dropdown-menu';
import { signOut } from '../actions/auth.action';
import { modalIds } from '../constants/modal-id.constants';
import UserSettingsDialog from './user-settings-dialog';

export const UserAvatar = ({ user }: { user: User }) => {
  const { openModal, closeModal } = useAppState();

  const handleSettingsClick = React.useCallback(() => {
    openModal({
      id: modalIds.userSettings,
      content: <UserSettingsDialog onCloseClick={() => closeModal({ id: modalIds.userSettings })} initialUser={user} />,
    });
  }, [closeModal, openModal, user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='cursor-pointer rounded-md'>
          <AvatarImage src={user.picture} alt={user.email} />
          <AvatarFallback>
            <UserRoundIcon size={16} className='opacity-60' aria-hidden='true' />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='max-w-64'>
        <DropdownMenuLabel className='flex items-center gap-3'>
          <Avatar className='rounded-md'>
            <AvatarImage src={user.picture} alt={user.email} />
            <AvatarFallback>
              <UserRoundIcon size={16} className='opacity-60' aria-hidden='true' />
            </AvatarFallback>
          </Avatar>
          <div className='flex min-w-0 flex-col'>
            <span className='truncate text-sm font-medium text-foreground'>{user.id}</span>
            <p className='truncate text-xs font-normal text-muted-foreground'>{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' onClick={handleSettingsClick}>
          <SettingsIcon size={16} className='opacity-60' aria-hidden='true' />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' onClick={() => signOut()}>
          <LogOutIcon size={16} className='opacity-60' aria-hidden='true' />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
