import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { GenerationError } from "@/lib/ai/client";
import { generateOutreach } from "@/lib/ai/generate";
import { entitlementsFor } from "@/lib/entitlements";
import { apiError, notFound, proOnly, unauthorized } from "@/lib/http";
import { loadSite } from "@/lib/sites";
import { getTemplate } from "@/templates";
import { publicOrigin } from "@/lib/url";

export const maxDuration = 60;

export async function POST(_: Request, { params }: { params: Promise<{ siteId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const loaded = await loadSite((await params).siteId);
  if (!loaded || loaded.site.userId !== user.id) return notFound("Site");
  if (!entitlementsFor(user).canDraftOutreach) return proOnly("The outreach helper");

  const { site, business } = loaded;
  try {
    const { draft } = await generateOutreach({
      business,
      operatorName: user.name,
      siteUrl: `${await publicOrigin()}/sites/${site.id}`,
      headline: site.copy.headline,
      templateId: getTemplate(site.templateId).id,
    });
    return NextResponse.json(draft);
  } catch (error) {
    if (error instanceof GenerationError) {
      console.error("Outreach generation failed", error.cause ?? error);
      return apiError(502, { code: "GENERATION_FAILED", error: error.userMessage, retryable: error.retryable });
    }
    throw error;
  }
}
