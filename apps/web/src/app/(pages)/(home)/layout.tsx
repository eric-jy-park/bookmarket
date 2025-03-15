import { TopNavbar } from '~/app/_common/components/top-nav-bar';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNavbar />
      <main className='mx-auto flex w-full max-w-2xl flex-col gap-4 pb-10'>{children}</main>
    </>
  );
}
