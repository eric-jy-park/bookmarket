import { BookmarkList } from '~/app/(pages)/(home)/_components/bookmark-list';
import { getSharedUsersBookmarks } from '../../_actions/shared.actions';

const SharedUserPage = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const bookmarks = await getSharedUsersBookmarks(username);

  return <BookmarkList bookmarks={bookmarks} isViewOnly={true} />;
};

export default SharedUserPage;
