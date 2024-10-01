import { Suspense } from "react";
import { BookmarkInput } from "./_components/bookmark-input";
import { BookmarkList } from "./_components/bookmark-list";
import { bookmarksQueries } from "./_state/queries/bookmark-query";
import { ServerPrefetcher } from "~/app/_common/providers/server-prefetcher";

export default async function HomePage() {
  return (
    <ServerPrefetcher query={bookmarksQueries.bookmarks()}>
      <main className="flex flex-col gap-4 pb-10">
        <h1 className="sr-only">
          {`Bookmarket - Buy and Sell Expert's Bookmark Collections`}
        </h1>
        <BookmarkInput />
        <BookmarkList />
      </main>
    </ServerPrefetcher>
  );
}
