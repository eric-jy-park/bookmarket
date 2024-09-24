import { AnimatedUnderlinedText } from "~/app/_core/components/animated-underlined-text";
import { Logo } from "./logo";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function TopNavbar() {
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="fade relative flex scroll-pr-6 flex-row items-center justify-between px-2 py-2 md:relative md:overflow-auto"
          id="nav"
        >
          <Logo />
          <SignedOut>
            <SignInButton>
              <AnimatedUnderlinedText>Sign In</AnimatedUnderlinedText>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
      </div>
    </aside>
  );
}
