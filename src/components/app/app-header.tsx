import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Badge } from "@/components/ui/badge";
import { entitlementsFor } from "@/lib/entitlements";
import type { User } from "@/lib/types";
import { AccountMenu } from "./account-menu";

/** Deliberately quiet: plan and usage sit in the corner, account options behind the avatar. */
export function AppHeader({ user }: { user: User }) {
  const e = entitlementsFor(user);
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo href="/dashboard" />
        <div className="flex items-center gap-3">
          {e.plan === "pro" ? (
            <Badge tone="accent">Pro</Badge>
          ) : (
            <Link
              href="/pricing"
              className="hidden rounded-md px-2 py-1 text-[13px] text-ink-3 transition-colors hover:text-ink sm:block"
            >
              <span className="tabular-nums">
                {e.generationsUsed} of {e.generationsLimit}
              </span>{" "}
              free site used
            </Link>
          )}
          <AccountMenu name={user.name} email={user.email} isPro={e.plan === "pro"} />
        </div>
      </div>
    </header>
  );
}
