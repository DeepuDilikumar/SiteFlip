"use client";

import { useEffect } from "react";
import { ArrowClockwise, WarningCircle } from "@phosphor-icons/react/ssr";
import { Button, ButtonLink } from "@/components/ui/button";

export default function MainError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 pt-[14vh] pb-16 text-center">
      <div className="grid size-12 place-items-center rounded-xl bg-danger-soft text-danger">
        <WarningCircle size={24} aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-xl font-semibold tracking-tight">Something went wrong on our side</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">
        Nothing you did caused this. Try again, and if it keeps happening, head back to your dashboard.
      </p>
      <div className="mt-8 flex gap-2">
        <ButtonLink href="/dashboard" variant="ghost">
          Dashboard
        </ButtonLink>
        <Button onClick={reset}>
          <ArrowClockwise size={16} aria-hidden="true" />
          Try again
        </Button>
      </div>
    </div>
  );
}
