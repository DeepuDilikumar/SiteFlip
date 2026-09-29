import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CaretRight, Globe, GlobeX, MagnifyingGlass, Star, WarningCircle } from "@phosphor-icons/react/ssr";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SearchForm } from "@/components/app/search-form";
import { requireUser } from "@/lib/auth/session";
import { leads } from "@/lib/db";
import { PlacesError, findBusinesses } from "@/lib/places";
import type { Business } from "@/lib/types";

type Props = { searchParams: Promise<{ niche?: string; city?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { niche, city } = await searchParams;
  return { title: niche && city ? `${capitalize(niche)} in ${city}` : "Results" };
}

export default async function ResultsPage({ searchParams }: Props) {
  const user = await requireUser();
  const { niche = "", city = "" } = await searchParams;
  if (!niche.trim() || !city.trim()) redirect("/find");

  let results: Business[];
  try {
    results = await findBusinesses({ niche, city });
  } catch (error) {
    if (!(error instanceof PlacesError)) throw error;
    return (
      <Shell niche={niche} city={city}>
        <Notice
          icon={<WarningCircle size={24} aria-hidden="true" />}
          title="We couldn't reach the business directory"
          body="This is usually temporary. Try the search again in a moment."
          action={
            <ButtonLink href={`/find/results?niche=${encodeURIComponent(niche)}&city=${encodeURIComponent(city)}`} variant="secondary">
              Try again
            </ButtonLink>
          }
        />
      </Shell>
    );
  }

  if (results.length === 0) {
    return (
      <Shell niche={niche} city={city}>
        <Notice
          icon={<MagnifyingGlass size={24} aria-hidden="true" />}
          title={`Every ${niche.toLowerCase()} in ${city} already has a website`}
          body="Try a neighbouring town, or a broader niche like “restaurants” instead of “sushi”."
        />
      </Shell>
    );
  }

  // Businesses this operator has already built for link straight to their preview.
  const built = new Map(
    (await Promise.all(results.map((b) => leads.findForBusiness(user.id, b.id)))).flatMap((lead) =>
      lead ? [[lead.businessId, lead.siteId] as const] : [],
    ),
  );
  const noSite = results.filter((b) => b.websiteStatus === "none").length;

  return (
    <Shell niche={niche} city={city}>
      <p className="text-sm text-ink-3 tabular-nums">
        {results.length} businesses · {noSite} with no website at all
      </p>
      <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl bg-surface shadow-card">
        {results.map((business) => {
          const siteId = built.get(business.id);
          return (
            <li key={business.id}>
              <Link
                href={siteId ? `/preview/${siteId}` : `/generate/${business.id}`}
                className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-canvas focus-visible:bg-canvas focus-visible:outline-offset-[-2px]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{business.name}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink-3">
                    <span>{business.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      <Star size={12} weight="fill" className="text-ink-2" aria-hidden="true" />
                      <span className="text-ink-2">{business.rating.toFixed(1)}</span>
                      <span>({business.reviewCount} reviews)</span>
                    </span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {siteId ? (
                    <Badge tone="neutral">Site built</Badge>
                  ) : business.websiteStatus === "none" ? (
                    <Badge tone="accent" icon={<GlobeX size={13} aria-hidden="true" />}>
                      No website detected
                    </Badge>
                  ) : (
                    <Badge tone="warn" icon={<Globe size={13} aria-hidden="true" />}>
                      <span title={business.websiteUrl}>Weak website detected</span>
                    </Badge>
                  )}
                  <CaretRight size={16} className="text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function Shell({ niche, city, children }: { niche: string; city: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <SearchForm niche={niche} city={city} size="compact" />
      <h1 className="mt-10 font-display text-4xl tracking-tight">
        {capitalize(niche.trim())} in {city.trim()}
      </h1>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Notice({ icon, title, body, action }: { icon: React.ReactNode; title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="mt-6 flex flex-col items-center rounded-2xl bg-surface px-6 py-14 text-center shadow-card">
      <div className="grid size-12 place-items-center rounded-xl bg-sunken text-ink-2">{icon}</div>
      <h2 className="mt-5 text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-2">{body}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
