import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { GenerationError } from "@/lib/ai/client";
import { apiError, notFound, unauthorized } from "@/lib/http";
import { LimitReachedError, NotFoundError, createSite } from "@/lib/sites";
import { isTemplateId, type TemplateId } from "@/templates";

// Copy generation can take a while on larger models.
export const maxDuration = 120;

const BodySchema = z.object({
  businessId: z.string().min(1),
  templateId: z.custom<TemplateId>(isTemplateId),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError(400, { code: "BAD_REQUEST", error: "Choose a business and a template." });
  }

  try {
    const site = await createSite(user, parsed.data.businessId, parsed.data.templateId);
    return NextResponse.json({ siteId: site.id }, { status: 201 });
  } catch (error) {
    if (error instanceof LimitReachedError) {
      return apiError(403, { code: "LIMIT_REACHED", error: "You've used your free generation this month." });
    }
    if (error instanceof NotFoundError) return notFound("Business");
    if (error instanceof GenerationError) {
      console.error("Site generation failed", error.cause ?? error);
      return apiError(502, { code: "GENERATION_FAILED", error: error.userMessage, retryable: error.retryable });
    }
    throw error;
  }
}
