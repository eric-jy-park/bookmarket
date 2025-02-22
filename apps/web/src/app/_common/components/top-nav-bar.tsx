import { AnimatedUnderlinedText } from "~/app/_core/components/animated-underlined-text";
import { Logo } from "./logo";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function TopNavbar() {
  return (
    <aside className="z-50 mb-4 w-full bg-background pt-2 tracking-tight sm:sticky sm:top-0 sm:mb-10">
      <nav
        className="fade relative flex scroll-pr-6 flex-row items-center justify-between px-2 py-2 pl-0 md:relative md:overflow-auto"
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
    </aside>
  );
}
