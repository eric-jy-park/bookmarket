import { BookmarkInput } from "./_components/bookmark-input";
import { BookmarkList } from "./_components/bookmark-list";
import { bookmarksQueries } from "./_state/queries/bookmark-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(bookmarksQueries.bookmarks());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex flex-col gap-4 pb-10">
        <h1 className="sr-only">
          {`Bookmarket - Buy and Sell Expert's Bookmark Collections`}
        </h1>
        <BookmarkInput />
        <BookmarkList />
      </main>
    </HydrationBoundary>
  );
}
