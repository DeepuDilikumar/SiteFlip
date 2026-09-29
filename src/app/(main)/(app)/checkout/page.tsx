import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Check, Info } from "@phosphor-icons/react/ssr";
import { CheckoutForm } from "@/components/app/checkout-form";
import { requireUser } from "@/lib/auth/session";
import { PRO_PRICE_MONTHLY_USD } from "@/lib/entitlements";

export const metadata: Metadata = { title: "Upgrade to Pro" };

const INCLUDED = ["Unlimited site generations", "No SiteFlip badge", "Code export and live links", "AI outreach drafts"];

export default async function CheckoutPage() {
  const user = await requireUser();
  if (user.plan === "pro") redirect("/dashboard");

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6 sm:py-16">
      <Link href="/pricing" className="inline-flex items-center gap-1.5 rounded-md text-[13px] text-ink-3 transition-colors hover:text-ink">
        <ArrowLeft size={14} aria-hidden="true" />
        Back to pricing
      </Link>
      <h1 className="mt-6 font-display text-4xl tracking-tight">Upgrade to Pro</h1>

      <div className="mt-8 rounded-2xl bg-surface p-6 shadow-card">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-medium">SiteFlip Pro</p>
          <p className="tabular-nums">
            <span className="text-lg font-semibold">${PRO_PRICE_MONTHLY_USD}</span>
            <span className="text-sm text-ink-3"> / month</span>
          </p>
        </div>
        <ul className="mt-5 grid gap-2.5 border-t border-line pt-5">
          {INCLUDED.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-ink-2">
              <Check size={15} weight="bold" className="text-accent" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-line pt-5 text-[13px] text-ink-3">
          For {user.email}. Cancel anytime from the pricing page.
        </p>
      </div>

      {/* Billing stub notice — see src/lib/billing.ts. */}
      <div className="mt-4 flex gap-3 rounded-xl bg-warn-soft p-4 text-[13px] leading-relaxed text-warn">
        <Info size={18} className="mt-px shrink-0" aria-hidden="true" />
        <p>
          <strong className="font-semibold">Test mode.</strong> Payments aren&rsquo;t connected in this build, so no card is
          collected or charged. Confirming activates Pro on your account immediately.
        </p>
      </div>

      <div className="mt-6">
        <CheckoutForm price={PRO_PRICE_MONTHLY_USD} />
      </div>
    </div>
  );
}
