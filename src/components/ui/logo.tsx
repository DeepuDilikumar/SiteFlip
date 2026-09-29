import Link from "next/link";
import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="6" width="13" height="16" rx="3" fill="currentColor" opacity="0.28" />
      <rect x="9" y="2" width="13" height="16" rx="3" fill="currentColor" />
    </svg>
  );
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2 rounded-md text-[15px] font-semibold tracking-tight text-ink", className)}
    >
      <LogoMark className="size-5" />
      SiteFlip
    </Link>
  );
}
