import { TopNavbar } from "~/app/_common/components/top-nav-bar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNavbar />
      {children}
    </>
  );
}
