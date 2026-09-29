import type { Metadata } from "next";
import { Check, Minus } from "@phosphor-icons/react/ssr";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/marketing-header";
import { getCurrentUser } from "@/lib/auth/session";
import { PRO_PRICE_MONTHLY_USD } from "@/lib/entitlements";
import { cn } from "@/lib/cn";
import { cancelPro } from "@/actions/billing";

export const metadata: Metadata = { title: "Pricing" };

type Cell = boolean | string;

const ROWS: { label: string; free: Cell; pro: Cell }[] = [
  { label: "Business search", free: true, pro: true },
  { label: "Site generations", free: "1 per month", pro: "Unlimited" },
  { label: "All three template families", free: true, pro: true },
  { label: "SiteFlip badge on sites", free: "Shown", pro: "Removed" },
  { label: "Code export (HTML, CSS, JS)", free: false, pro: true },
  { label: "Live, shareable site link", free: false, pro: true },
  { label: "AI outreach message drafts", free: false, pro: true },
  { label: "Early access to new templates", free: false, pro: true },
];

function CellValue({ value }: { value: Cell }) {
  if (value === true) return <Check size={16} weight="bold" className="text-accent" aria-label="Included" />;
  if (value === false) return <Minus size={16} className="text-ink-3" aria-label="Not included" />;
  return <span className="text-ink">{value}</span>;
}

export default async function PricingPage() {
  const user = await getCurrentUser();
  const isPro = user?.plan === "pro";

  const freeAction = !user ? (
    <ButtonLink href="/signup" variant="secondary" className="w-full">
      Get started
    </ButtonLink>
  ) : (
    <p className="flex h-10 items-center justify-center text-sm text-ink-3">{isPro ? "Included in Pro" : "Your current plan"}</p>
  );

  const proAction = isPro ? (
    <div className="grid justify-items-center gap-1">
      <p className="flex h-10 items-center text-sm text-accent">Your current plan</p>
      <form action={cancelPro}>
        <button type="submit" className="cursor-pointer rounded text-[13px] text-ink-3 underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink">
          Cancel Pro
        </button>
      </form>
    </div>
  ) : (
    <ButtonLink href={user ? "/checkout" : "/signup"} className="w-full">
      {user ? "Upgrade to Pro" : "Start free, upgrade anytime"}
    </ButtonLink>
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <MarketingHeader />
      <main id="main" className="mx-auto w-full max-w-4xl flex-1 px-4 pt-16 pb-24 sm:px-6">
        <h1 className="text-center font-display text-5xl tracking-tight sm:text-6xl">Simple pricing</h1>
        <p className="mx-auto mt-3 max-w-md text-center text-[15px] text-ink-2">
          One closed client covers a year of Pro. Start free and upgrade when you&rsquo;re ready to send.
        </p>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <PlanCard name="Free" price="$0" note="Try the full flow on one business." action={freeAction} />
          <PlanCard
            name="Pro"
            price={`$${PRO_PRICE_MONTHLY_USD}`}
            note="For operators pitching every week."
            action={proAction}
            featured
          />
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Free and Pro plan comparison</caption>
            <thead className="border-b border-line text-[13px] text-ink-3">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">
                  Feature
                </th>
                <th scope="col" className="w-32 px-5 py-3 font-medium sm:w-40">
                  Free
                </th>
                <th scope="col" className="w-32 px-5 py-3 font-medium sm:w-40">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="px-5 py-3.5 font-normal text-ink-2">
                    {row.label}
                  </th>
                  <td className="px-5 py-3.5">
                    <CellValue value={row.free} />
                  </td>
                  <td className="px-5 py-3.5">
                    <CellValue value={row.pro} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}

function PlanCard({ name, price, note, action, featured }: { name: string; price: string; note: string; action: React.ReactNode; featured?: boolean }) {
  return (
    <section
      aria-label={`${name} plan`}
      className={cn("flex flex-col rounded-2xl bg-surface p-6 sm:p-8", featured ? "shadow-[0_0_0_2px_var(--color-ink),0_8px_24px_rgb(21_21_19/0.08)]" : "shadow-card")}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-medium">{name}</h2>
        {featured ? <Badge tone="accent">Most operators</Badge> : null}
      </div>
      <p className="mt-4 flex items-baseline gap-1.5">
        <span className="font-display text-5xl tracking-tight tabular-nums">{price}</span>
        <span className="text-sm text-ink-3">/ month</span>
      </p>
      <p className="mt-2 text-sm text-ink-2">{note}</p>
      <div className="mt-8">{action}</div>
    </section>
  );
}
