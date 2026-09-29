import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PreviewShell } from "@/components/app/preview-shell";
import { requireUser } from "@/lib/auth/session";
import { entitlementsFor } from "@/lib/entitlements";
import { loadSite } from "@/lib/sites";
import { getTemplate } from "@/templates";
import { publicOrigin } from "@/lib/url";

type Props = { params: Promise<{ siteId: string }> };

export const metadata: Metadata = { title: "Preview" };

export default async function PreviewPage({ params }: Props) {
  const user = await requireUser();
  const loaded = await loadSite((await params).siteId);
  if (!loaded || loaded.site.userId !== user.id) notFound();

  const { site, business } = loaded;
  return (
    <PreviewShell
      siteId={site.id}
      siteUrl={`${await publicOrigin()}/sites/${site.id}`}
      businessName={business.name}
      templateName={getTemplate(site.templateId).name}
      entitlements={entitlementsFor(user)}
      offlineCopy={site.copySource === "offline"}
    />
  );
}
