'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const HomeContent = () => {
  const router = useRouter();

  const handleJoinNowButtonClick = () => {
    router.push('/login');
  };

  const handleGithubButtonClick = () => {
    router.push('https://github.com/eric-jy-park/bookmarket');
  };

  return (
    <div className='fixed left-0 top-44 flex size-full flex-col items-center justify-start overflow-hidden'>
      <motion.h2
        className='text-7xl font-black'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Your Bookmarks, <span className='rounded bg-yellow-200 px-2'>Reimagined</span>
      </motion.h2>
      <motion.p
        className='mt-6 text-2xl text-gray-600'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Organize, discover, and access your favorite sites in one place
      </motion.p>

      <motion.div
        className='mt-6 flex gap-4'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.button
          onClick={handleJoinNowButtonClick}
          className='rounded-full bg-black px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-gray-800'
        >
          Join Now
        </motion.button>
        <motion.button
          onClick={handleGithubButtonClick}
          className='rounded-full border-2 border-black px-8 py-3 text-lg font-bold transition-colors hover:bg-gray-100'
        >
          Github
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <Image
          src={'/images/screenshot.png'}
          alt='Screenshot of the bookmarket service'
          width={1920}
          height={1080}
          className='my-8 h-auto w-[1280px] overflow-hidden rounded-2xl border-2 border-black'
        />
      </motion.div>
    </div>
  );
};
