import Link from "next/link";
import { Logo } from "./logo";

export function TopNavbar() {
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="fade relative flex scroll-pr-6 flex-row items-center justify-between px-0 pb-0 md:relative md:overflow-auto"
          id="nav"
        >
          <Logo />
          <Link href={"/login"}>Login</Link>
        </nav>
      </div>
    </aside>
  );
}
