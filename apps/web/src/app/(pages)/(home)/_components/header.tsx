'use client';

import { useRouter } from 'next/navigation';
import { Logo } from '~/app/_common/components/logo';
import { Button } from '~/app/_core/components/button';

export const HomeHeader = () => {
  const router = useRouter();

  const handleJoinNowButtonClick = () => {
    router.push('/login');
  };

  return (
    <div className='fixed left-0 top-0 flex h-32 w-full items-center justify-between px-8 backdrop-blur-xl'>
      <div className='flex items-center gap-2'>
        <Logo includeText={false} className='z-10 size-12' />
        <h1 className='text-3xl font-black'>Bookmarket</h1>
      </div>
      <Button onClick={handleJoinNowButtonClick} className='h-14 w-40 rounded-full bg-black text-xl'>
        Join Now
      </Button>
    </div>
  );
};
