"use client";

import Form from "next/form";
import { useFormStatus } from "react-dom";
import { ArrowRight, MagnifyingGlass, MapPin } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";
import { Spinner } from "@/components/ui/spinner";

type Props = { niche?: string; city?: string; size?: "hero" | "compact" };

function SubmitButton({ size }: { size: "hero" | "compact" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-label="Search"
      disabled={pending}
      className={cn(
        "grid shrink-0 cursor-pointer place-items-center rounded-xl bg-ink text-white transition-[background-color,transform] duration-150 hover:bg-[#2c2b28] active:scale-[0.97] disabled:opacity-70",
        size === "hero" ? "size-12" : "size-9 rounded-lg",
      )}
    >
      {pending ? <Spinner className="size-4" /> : <ArrowRight size={size === "hero" ? 20 : 16} aria-hidden="true" />}
    </button>
  );
}

/**
 * Niche + city in one control. Uses next/form so submitting is a client-side
 * navigation to /find/results, with the results skeleton shown immediately.
 */
export function SearchForm({ niche = "", city = "", size = "hero" }: Props) {
  const hero = size === "hero";
  const inputClass = cn(
    "min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-3",
    hero ? "h-12 text-base sm:text-[17px]" : "h-9 text-sm",
  );

  return (
    <Form
      action="/find/results"
      className={cn(
        "flex w-full flex-col gap-2 bg-surface shadow-raised transition-shadow focus-within:shadow-[0_0_0_1px_var(--color-accent),0_0_0_5px_var(--color-accent-soft),0_8px_24px_rgb(21_21_19/0.08)] sm:flex-row sm:items-center sm:gap-0",
        hero ? "rounded-2xl p-2 sm:p-2" : "rounded-xl p-1.5",
      )}
    >
      <label className={cn("flex flex-1 items-center gap-3", hero ? "px-3" : "px-2.5")}>
        <MagnifyingGlass size={hero ? 20 : 16} className="shrink-0 text-ink-3" aria-hidden="true" />
        <span className="sr-only">Business niche</span>
        <input name="niche" defaultValue={niche} placeholder="Plumbers, restaurants, salons…" required autoComplete="off" className={inputClass} />
      </label>
      <span className="mx-1 hidden h-6 w-px bg-line sm:block" aria-hidden="true" />
      <span className="mx-3 h-px bg-line sm:hidden" aria-hidden="true" />
      <label className={cn("flex flex-1 items-center gap-3", hero ? "px-3" : "px-2.5")}>
        <MapPin size={hero ? 20 : 16} className="shrink-0 text-ink-3" aria-hidden="true" />
        <span className="sr-only">City or area</span>
        <input name="city" defaultValue={city} placeholder="City or area" required autoComplete="address-level2" className={inputClass} />
        <SubmitButton size={size} />
      </label>
    </Form>
  );
}
