'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { Button } from '~/app/_core/components/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/app/_core/components/dialog';
import { Input } from '~/app/_core/components/input';
import { Label } from '~/app/_core/components/label';
import { Switch } from '~/app/_core/components/switch';

export default function UserSettingsDialog({ onCloseClick }: { onCloseClick: () => void }) {
  const handleCancelClick = React.useCallback(() => {
    onCloseClick();
  }, [onCloseClick]);

  const handleSaveClick = React.useCallback(async () => {
    onCloseClick();
  }, [onCloseClick]);

  return (
    <motion.div
      className={'relative w-full max-w-md rounded-xl bg-white p-0'}
      onClick={e => {
        e.stopPropagation();
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <DialogHeader className='contents space-y-0 text-left'>
        <DialogTitle className='border-b px-6 py-4 text-base'>Edit profile</DialogTitle>
      </DialogHeader>
      <DialogDescription className='sr-only'>
        Make changes to your profile here. You can change your photo and set a username.
      </DialogDescription>
      <div className='overflow-y-auto'>
        <div className='px-6 pb-6 pt-4'>
          <form className='space-y-5'>
            <div className='flex flex-col gap-4 sm:flex-row'>
              <div className='flex-1 space-y-2'>
                <Label htmlFor={`firstName`}>First Name</Label>
                <Input id={`firstName`} placeholder='Eric' defaultValue='Eric' type='text' required />
              </div>
              <div className='flex-1 space-y-2'>
                <Label htmlFor={`lastName`}>Last Name</Label>
                <Input id={`lastName`} placeholder='Park' defaultValue='Park' type='text' required />
              </div>
            </div>
            <div className='*:not-first:mt-2'>
              <Label htmlFor={`userName`}>Personal Subdomain</Label>
              <div className='shadow-xs flex rounded-md'>
                <span className='inline-flex items-center rounded-s-md border border-input bg-background px-3 text-sm text-muted-foreground'>
                  https://
                </span>
                <Input placeholder='google' type='text' className='mr-px rounded-none border-x-0' />
                <span className='inline-flex items-center rounded-e-md border border-input bg-background px-3 text-sm text-muted-foreground'>
                  .bmkt.tech
                </span>
              </div>
            </div>
            <div className='mt-2 flex items-center justify-end gap-2'>
              <Label htmlFor={`userName`}>Allow public access</Label>
              <Switch
                className='h-5 w-8 [&_span]:size-4 data-[state=checked]:[&_span]:translate-x-3 data-[state=checked]:[&_span]:rtl:-translate-x-3'
                defaultChecked
              />
            </div>
          </form>
        </div>
      </div>
      <DialogFooter className='border-t px-6 py-4'>
        <Button type='button' variant='outline' onClick={handleCancelClick}>
          Cancel
        </Button>
        <Button type='button' onClick={handleSaveClick}>
          Save changes
        </Button>
      </DialogFooter>
    </motion.div>
  );
}
