import { getBookmarks } from "~/server/queries/bookmark";
import { BookmarkInput } from "./_components/bookmark-input";
import { BookmarkList } from "./_components/bookmark-list";

export default async function HomePage() {
  const bookmarks = await getBookmarks();

  return (
    <main className="flex flex-col gap-4">
      <BookmarkInput />
      <BookmarkList bookmarks={bookmarks} />
    </main>
  );
}
