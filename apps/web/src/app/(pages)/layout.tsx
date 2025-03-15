import '~/styles/globals.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';
import { GlobalProvider } from '../_common/providers/global-provider';
import { Toaster } from '../_core/components/toaster';
import { cn } from '../_core/utils/cn';

export const metadata: Metadata = {
  title: {
    default: 'Bookmarket',
    template: '%s',
  },
  description: `(Don't) Manage your bookmarks (with Chrome)`,
  keywords: [
    'bookmarks',
    'curated collections',
    'knowledge sharing',
    'expert resources',
    'web curation',
    'digital marketplace',
    'buy bookmarks',
    'sell bookmarks',
  ],
  authors: [{ name: 'Eric Park' }],
  creator: 'Eric Park',
  publisher: 'Eric Park',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bmkt.tech',
    title: 'BookMarket',
    description: `(Don't) Manage your bookmarks (with Chrome)`,
    siteName: 'BookMarket',
    images: [
      {
        url: 'https://p7b6whnm9b.ufs.sh/f/xLzQ78o3fSpatx1TZw7KQoHa9kRpM2EX5IhBlwyVWfxPrde0',
        width: 1600,
        height: 840,
        alt: `BookMarket - (Don't) Manage your bookmarks (with Chrome)`,
      },
    ],
  },
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' className={cn(GeistSans.variable)}>
      <head>
        <meta name='google-site-verification' content='ww7YPb1kClVezWYDUBhYUWDPFWBPqRuTxZjX4YJb45U' />
      </head>
      <body className='select-none sm:select-text'>
        <GlobalProvider>
          <main className='mx-auto flex w-full min-w-0 flex-auto select-none flex-col px-5 antialiased sm:select-text sm:px-4'>
            {children}
            <Toaster position='bottom-center' className='hidden sm:block' />
            <Toaster position='top-center' className='block sm:hidden' duration={2000} />
            <Analytics />
            <SpeedInsights />
          </main>
        </GlobalProvider>
      </body>
    </html>
  );
}
