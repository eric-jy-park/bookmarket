import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TopNavbar } from "~/app/_common/components/top-nav-bar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cn } from "../_core/utils/cn";
import { GlobalProvider } from "../_common/providers/global-provider";
import { Toaster } from "../_core/components/toaster";

export const metadata: Metadata = {
  title: {
    default: "Bookmarket",
    template: "%s",
  },
  description:
    "Discover expert-curated bookmark collections or monetize your own web resources on BookMarket. Connect with knowledge seekers and share valuable online content.",
  keywords: [
    "bookmarks",
    "curated collections",
    "knowledge sharing",
    "expert resources",
    "web curation",
    "digital marketplace",
    "buy bookmarks",
    "sell bookmarks",
  ],
  authors: [{ name: "Eric Park" }],
  creator: "Eric Park",
  publisher: "Eric Park",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bmkt.tech",
    title: "BookMarket - Buy and Sell Curated Bookmark Collections",
    description:
      "Discover expert-curated bookmark collections or monetize your own web resources on BookMarket. Connect with knowledge seekers and share valuable online content.",
    siteName: "BookMarket",
    images: [
      {
        url: "https://utfs.io/f/xLzQ78o3fSpa5oVbiU4FX9O4zvxkP8oepgE3dacNjwsR7yTY",
        width: 1200,
        height: 1200,
        alt: "BookMarket - Buy and Sell Curated Bookmark Collections",
      },
    ],
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/site.webmanifest",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(GeistSans.variable)}>
      <head>
        <meta
          name="google-site-verification"
          content="ww7YPb1kClVezWYDUBhYUWDPFWBPqRuTxZjX4YJb45U"
        />
      </head>
      <body>
        <GlobalProvider>
          <main className="mx-auto flex w-full min-w-0 max-w-2xl flex-auto select-none flex-col px-5 antialiased sm:select-text sm:px-4">
            <TopNavbar />
            {children}
            <Toaster position="bottom-center" />
            <Analytics />
            <SpeedInsights />
          </main>
        </GlobalProvider>
      </body>
    </html>
  );
}
