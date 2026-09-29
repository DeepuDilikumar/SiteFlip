import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, MagnifyingGlass, Storefront } from "@phosphor-icons/react/ssr";
import { ButtonLink } from "@/components/ui/button";
import { StatusSelect } from "@/components/app/status-select";
import { requireUser } from "@/lib/auth/session";
import { businesses, leads, sites } from "@/lib/db";
import { getTemplate } from "@/templates";

export const metadata: Metadata = { title: "Dashboard" };

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ upgraded?: string }> }) {
  const user = await requireUser();
  const { upgraded } = await searchParams;
  const pipeline = await leads.listForUser(user.id);
  const [businessList, siteList] = await Promise.all([
    businesses.findMany(pipeline.map((l) => l.businessId)),
    sites.findMany(pipeline.map((l) => l.siteId)),
  ]);
  const businessById = new Map(businessList.map((b) => [b.id, b]));
  const siteById = new Map(siteList.map((s) => [s.id, s]));

  const rows = pipeline.flatMap((lead) => {
    const business = businessById.get(lead.businessId);
    const site = siteById.get(lead.siteId);
    return business && site ? [{ lead, business, site }] : [];
  });

  const counts = {
    contacted: rows.filter((r) => r.lead.status === "contacted").length,
    closed: rows.filter((r) => r.lead.status === "closed").length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {upgraded ? (
        <div role="status" className="mb-8 flex animate-fade-in items-center gap-3 rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent">
          <CheckCircle size={18} weight="fill" aria-hidden="true" />
          <span>
            <strong className="font-semibold">You&rsquo;re on Pro.</strong> Unlimited generations, code export and the outreach
            helper are unlocked.
          </span>
        </div>
      ) : null}

      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl tracking-tight">Pipeline</h1>
              <p className="mt-1 text-sm text-ink-3 tabular-nums">
                {rows.length} {rows.length === 1 ? "site" : "sites"} · {counts.contacted} contacted · {counts.closed} closed
              </p>
            </div>
            <ButtonLink href="/find" size="lg">
              <MagnifyingGlass size={18} aria-hidden="true" />
              Find businesses
            </ButtonLink>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl bg-surface shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-[13px] text-ink-3">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Business
                  </th>
                  <th scope="col" className="hidden px-5 py-3 font-medium md:table-cell">
                    Template
                  </th>
                  <th scope="col" className="hidden px-5 py-3 font-medium sm:table-cell">
                    Created
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="w-12 px-5 py-3">
                    <span className="sr-only">Open</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map(({ lead, business, site }) => (
                  <tr key={lead.id} className="group transition-colors hover:bg-canvas">
                    <td className="px-5 py-4">
                      <Link href={`/preview/${site.id}`} className="rounded font-medium text-ink">
                        {business.name}
                      </Link>
                      <p className="mt-0.5 text-[13px] text-ink-3">
                        {business.category} · {business.city}
                      </p>
                    </td>
                    <td className="hidden px-5 py-4 text-ink-2 md:table-cell">{getTemplate(site.templateId).name}</td>
                    <td className="hidden px-5 py-4 text-ink-2 tabular-nums sm:table-cell">
                      {dateFormat.format(new Date(lead.createdAt))}
                    </td>
                    <td className="px-5 py-4">
                      <StatusSelect leadId={lead.id} status={lead.status} businessName={business.name} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/preview/${site.id}`}
                        aria-label={`Open ${business.name} preview`}
                        className="inline-grid size-8 place-items-center rounded-lg text-ink-3 transition-colors group-hover:text-ink hover:bg-sunken"
                      >
                        <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center pt-[8vh] text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-surface text-ink-2 shadow-card">
        <Storefront size={26} aria-hidden="true" />
      </div>
      <h1 className="mt-6 font-display text-4xl tracking-tight">You haven&rsquo;t found any businesses yet</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
        Search a niche and a city. We&rsquo;ll surface local businesses with no website — or a weak one — and you can build
        each of them a site in about 90 seconds.
      </p>
      <ButtonLink href="/find" size="lg" className="mt-8">
        <MagnifyingGlass size={18} aria-hidden="true" />
        Find businesses
      </ButtonLink>
    </div>
  );
}
