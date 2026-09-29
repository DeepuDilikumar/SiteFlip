import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { users } from "@/lib/db";
import { entitlementsFor } from "@/lib/entitlements";
import { loadSite, toSiteBusiness } from "@/lib/sites";
import { getTemplate } from "@/templates";
import { liveKit } from "@/templates/kit/live";

type Props = { params: Promise<{ siteId: string }> };

/**
 * The generated site itself. Pro sites are public (this URL is their deploy
 * link); free-plan sites are a private, watermarked preview for their owner.
 */
async function resolve(siteId: string) {
  const loaded = await loadSite(siteId);
  if (!loaded) return null;
  const owner = await users.findById(loaded.site.userId);
  if (!owner) return null;
  const entitlements = entitlementsFor(owner);
  if (entitlements.showWatermark) {
    const viewer = await getCurrentUser();
    if (viewer?.id !== owner.id) return null;
  }
  return { ...loaded, watermark: entitlements.showWatermark };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await resolve((await params).siteId);
  if (!resolved) return { title: "Site not found", robots: { index: false } };
  const { copy } = resolved.site;
  return {
    title: copy.meta.title,
    description: copy.meta.description,
    robots: resolved.watermark ? { index: false } : undefined,
  };
}

export default async function SitePage({ params }: Props) {
  const resolved = await resolve((await params).siteId);
  if (!resolved) notFound();

  const { site, business, watermark } = resolved;
  const template = getTemplate(site.templateId);
  const Template = template.Component;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={template.fontsHref} precedence="default" />
      <Template business={toSiteBusiness(business)} copy={site.copy} kit={liveKit} watermark={watermark} />
    </>
  );
}
