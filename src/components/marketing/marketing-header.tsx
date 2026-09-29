import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";

export async function MarketingHeader() {
  const user = await getCurrentUser();
  return (
    <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
      <Logo />
      <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
        <Link href="/pricing" className="rounded-md px-3 py-2 text-sm text-ink-2 transition-colors hover:text-ink">
          Pricing
        </Link>
        {user ? (
          <ButtonLink href="/dashboard" variant="secondary" size="sm">
            Dashboard
          </ButtonLink>
        ) : (
          <>
            <Link href="/login" className="rounded-md px-3 py-2 text-sm text-ink-2 transition-colors hover:text-ink">
              Log in
            </Link>
            <ButtonLink href="/signup" size="sm">
              Get started
            </ButtonLink>
          </>
        )}
      </nav>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-[13px] text-ink-3 sm:flex-row sm:justify-between sm:px-6">
        <span>© {new Date().getFullYear()} SiteFlip</span>
        <span>Built for people who sell websites to local businesses.</span>
      </div>
    </footer>
  );
}
