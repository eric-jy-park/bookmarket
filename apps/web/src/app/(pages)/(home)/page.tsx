import { BookmarkInput } from "./_components/bookmark-input";
import { BookmarkList } from "./_components/bookmark-list";
import { getBookmarks } from "~/server/queries/bookmark";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId, redirectToSignIn } = auth();

  if (!userId) return redirectToSignIn();

  const bookmarks = await getBookmarks();

  return (
    <main className="flex flex-col gap-4 pb-10">
      <h1 className="sr-only">
        {`Bookmarket - Buy and Sell Expert's Bookmark Collections`}
      </h1>
      <BookmarkInput />
      <BookmarkList bookmarks={bookmarks} />
    </main>
  );
}
