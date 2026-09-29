import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6">
        <Logo />
      </header>
      <main id="main" className="flex flex-1 flex-col items-center justify-center px-4 pb-24 text-center">
        <p className="text-[13px] font-medium text-ink-3 tabular-nums">404</p>
        <h1 className="mt-2 font-display text-5xl tracking-tight">This page doesn&rsquo;t exist</h1>
        <p className="mt-3 max-w-sm text-[15px] text-ink-2">
          The link may be old, or the site may belong to another account.
        </p>
        <ButtonLink href="/dashboard" className="mt-8">
          Go to dashboard
        </ButtonLink>
      </main>
    </div>
  );
}
