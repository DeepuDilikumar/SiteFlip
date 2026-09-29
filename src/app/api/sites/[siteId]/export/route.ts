import { getCurrentUser } from "@/lib/auth/session";
import { entitlementsFor } from "@/lib/entitlements";
import { buildSiteZip } from "@/lib/export";
import { notFound, proOnly, unauthorized } from "@/lib/http";
import { loadSite } from "@/lib/sites";

export async function GET(_: Request, { params }: { params: Promise<{ siteId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const loaded = await loadSite((await params).siteId);
  if (!loaded || loaded.site.userId !== user.id) return notFound("Site");
  if (!entitlementsFor(user).canExport) return proOnly("Code export");

  const { filename, data } = await buildSiteZip(loaded.site, loaded.business);
  return new Response(data as BodyInit, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
