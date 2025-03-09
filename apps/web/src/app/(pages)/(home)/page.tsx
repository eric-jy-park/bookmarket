import { BookmarkInput } from "./_components/bookmark-input";
import { BookmarkList } from "./_components/bookmark-list";
import { getBookmarks } from "~/app/_common/actions/bookmark.action";

export default async function HomePage() {
  const bookmarks = await getBookmarks();

  return (
    <>
      <h1 className="sr-only">
        {`Bookmarket - Buy and Sell Expert's Bookmark Collections`}
      </h1>
      <BookmarkInput />
      <BookmarkList bookmarks={bookmarks} />
    </>
  );
}
