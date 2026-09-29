"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type MenuProps = {
  trigger: (props: { open: boolean }) => ReactNode;
  label: string;
  children: ReactNode;
  align?: "start" | "end";
};

/**
 * A small disclosure menu: click to open, Escape or outside click to close,
 * focus returns to the trigger. Items are ordinary links and buttons.
 */
export function Menu({ trigger, label, children, align = "end" }: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer rounded-full"
      >
        {trigger({ open })}
      </button>
      {open ? (
        <div
          id={panelId}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a,button")) setOpen(false);
          }}
          className={cn(
            "absolute top-full z-40 mt-2 w-64 animate-fade-in rounded-xl bg-surface p-1.5 shadow-raised",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export const menuItemClasses =
  "flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-left text-sm text-ink-2 " +
  "transition-colors hover:bg-sunken hover:text-ink";
