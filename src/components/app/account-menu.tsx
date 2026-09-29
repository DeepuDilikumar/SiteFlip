"use client";

import Link from "next/link";
import { ArrowUpRight, CreditCard, MagnifyingGlass, SignOut, SquaresFour } from "@phosphor-icons/react/ssr";
import { logout } from "@/actions/auth";
import { Menu, menuItemClasses } from "@/components/ui/menu";

type Props = { name: string; email: string; isPro: boolean };

export function AccountMenu({ name, email, isPro }: Props) {
  const initial = name.trim()[0]?.toUpperCase() ?? "?";
  return (
    <Menu
      label="Account menu"
      trigger={({ open }) => (
        <span
          className={`grid size-8 place-items-center rounded-full bg-ink text-[13px] font-semibold text-white transition-shadow ${
            open ? "shadow-[0_0_0_3px_var(--color-line)]" : "hover:shadow-[0_0_0_3px_var(--color-line)]"
          }`}
        >
          {initial}
        </span>
      )}
    >
      <div className="border-b border-line px-2.5 pt-1.5 pb-2.5">
        <p className="truncate text-sm font-medium text-ink">{name}</p>
        <p className="truncate text-[13px] text-ink-3">{email}</p>
      </div>
      <div className="grid gap-0.5 py-1.5">
        <Link href="/dashboard" className={menuItemClasses}>
          <SquaresFour size={16} aria-hidden="true" /> Dashboard
        </Link>
        <Link href="/find" className={menuItemClasses}>
          <MagnifyingGlass size={16} aria-hidden="true" /> Find businesses
        </Link>
        <Link href="/pricing" className={menuItemClasses}>
          {isPro ? <CreditCard size={16} aria-hidden="true" /> : <ArrowUpRight size={16} aria-hidden="true" />}
          {isPro ? "Plan & billing" : "Upgrade to Pro"}
        </Link>
      </div>
      <form action={logout} className="border-t border-line pt-1.5">
        <button type="submit" className={menuItemClasses}>
          <SignOut size={16} aria-hidden="true" /> Log out
        </button>
      </form>
    </Menu>
  );
}
