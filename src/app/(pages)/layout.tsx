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
  title: "Bookmarket",
  description: "Buy and sell your bookmarks at ease.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(GeistSans.variable)}>
      <body>
        <GlobalProvider>
          <main className="mx-auto flex w-full min-w-0 max-w-2xl flex-auto flex-col px-5 antialiased sm:px-4">
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
