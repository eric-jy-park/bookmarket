import { getSharedUsersCategories } from '../../_actions/shared.actions';
import { SharedTopNavBar } from '../../_components/shared-top-nav-bar';

export default async function SharedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const categories = await getSharedUsersCategories(username);
  return (
    <>
      <SharedTopNavBar categories={categories} sharedUsername={username} />
      <main className='mx-auto flex w-full max-w-2xl flex-col gap-4 py-4 pb-10'>{children}</main>
    </>
  );
}
