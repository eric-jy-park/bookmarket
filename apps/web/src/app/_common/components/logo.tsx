import Image from 'next/image';
import Link from 'next/link';
import { cn } from '~/app/_core/utils/cn';

export const Logo = ({
  className,
  includeText = true,
  sharedUsername,
}: {
  className?: string;
  includeText?: boolean;
  sharedUsername?: string;
}) => {
  return (
    <Link className='flex cursor-pointer items-center gap-1' href='/'>
      <Image
        src='/images/logo.png'
        alt='logo'
        width={120}
        height={120}
        className={cn('size-7', className)}
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
      {includeText && <h1 className='text-lg font-black'>{sharedUsername ?? 'Bookmarket'}</h1>}
    </Link>
  );
};
