import Link from "next/link";
import { getMe } from "../actions/auth.action";
import { Logo } from "./logo";
import { UserAvatar } from "./user-avatar";
import { AnimatedTab } from "./animated-tab";

export async function TopNavbar() {
  const user = await getMe();

  const tabs = [
    { label: "UI/UX", value: "ui-ux" },
    { label: "Web", value: "web" },
    { label: "Mobile", value: "mobile" },
    { label: "Design", value: "design" },
    { label: "Marketing", value: "marketing" },
    { label: "Other", value: "other" },
  ];

  return (
    <aside className="sticky top-0 z-50 w-full bg-background pt-2 tracking-tight">
      <nav
        className="fade relative flex items-center justify-between overflow-auto py-2"
        id="nav"
      >
        <span className="hidden md:block">
          <Logo />
        </span>
        <span className="block md:hidden">
          <Logo includeText={false} />
        </span>
        <AnimatedTab tabs={tabs} />
        {user ? <UserAvatar user={user} /> : <Link href="/login">Login</Link>}
      </nav>
    </aside>
  );
}
