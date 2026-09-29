import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, GlobeX, MapPin, Phone, Star } from "@phosphor-icons/react/ssr";
import { Badge } from "@/components/ui/badge";
import { GenerateFlow, type TemplateOption } from "@/components/app/generate-flow";
import { requireUser } from "@/lib/auth/session";
import { businesses, leads } from "@/lib/db";
import { entitlementsFor } from "@/lib/entitlements";
import { nicheByKey } from "@/lib/niches";
import { TEMPLATES, TEMPLATE_IDS } from "@/templates";

type Props = { params: Promise<{ businessId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const business = await businesses.findById((await params).businessId);
  return { title: business ? `Generate · ${business.name}` : "Generate" };
}

export default async function GeneratePage({ params }: Props) {
  const user = await requireUser();
  const business = await businesses.findById((await params).businessId);
  if (!business) notFound();

  const existing = await leads.findForBusiness(user.id, business.id);
  const templates: TemplateOption[] = TEMPLATE_IDS.map((id) => {
    const { name, summary, bestFor } = TEMPLATES[id];
    return { id, name, summary, bestFor };
  });
  const featuredReview = business.reviews[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href={`/find/results?niche=${encodeURIComponent(business.category)}&city=${encodeURIComponent(business.city)}`}
        className="inline-flex items-center gap-1.5 rounded-md text-[13px] text-ink-3 transition-colors hover:text-ink"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to results
      </Link>

      <header className="mt-6 flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-4xl tracking-tight sm:text-5xl">{business.name}</h1>
            {business.websiteStatus === "none" ? (
              <Badge tone="accent" icon={<GlobeX size={13} aria-hidden="true" />}>
                No website detected
              </Badge>
            ) : (
              <Badge tone="warn" icon={<Globe size={13} aria-hidden="true" />}>
                Weak website detected
              </Badge>
            )}
          </div>
          <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-2">
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Rating</dt>
              <Star size={14} weight="fill" aria-hidden="true" />
              <dd className="tabular-nums">
                {business.rating.toFixed(1)} · {business.reviewCount} reviews
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Address</dt>
              <MapPin size={14} aria-hidden="true" />
              <dd>{business.address}</dd>
            </div>
            {business.phone ? (
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Phone</dt>
                <Phone size={14} aria-hidden="true" />
                <dd className="tabular-nums">{business.phone}</dd>
              </div>
            ) : null}
          </dl>
        </div>
        {featuredReview ? (
          <figure className="max-w-sm text-sm md:text-right">
            <blockquote className="text-ink-2 italic">&ldquo;{featuredReview.text}&rdquo;</blockquote>
            <figcaption className="mt-1.5 text-[13px] text-ink-3">{featuredReview.author}</figcaption>
          </figure>
        ) : null}
      </header>

      <div className="mt-8">
        <GenerateFlow
          businessId={business.id}
          businessName={business.name}
          category={business.category}
          reviewCount={business.reviews.length}
          templates={templates}
          recommended={nicheByKey(business.niche).recommendedTemplate}
          canGenerate={entitlementsFor(user).canGenerate}
          rebuilding={Boolean(existing)}
        />
      </div>
    </div>
  );
}
