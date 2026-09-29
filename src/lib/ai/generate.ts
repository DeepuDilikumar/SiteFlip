import "server-only";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";
import type { Business, CopySource } from "@/lib/types";
import { nicheByKey } from "@/lib/niches";
import { TEMPLATES } from "@/templates";
import type { TemplateId } from "@/templates/types";
import { FALLBACK_BETA, GenerationError, MODEL, claude, hasClaudeCredentials, toGenerationError } from "./client";
import { offlineOutreach, offlineSiteCopy } from "./offline";
import { OutreachSchema, SiteCopySchema, type OutreachDraft, type SiteCopy } from "./schemas";

const COPYWRITER_SYSTEM = `You write website copy for small local businesses. Your copy reads like it was written by someone who visited the business, not by a marketing agency.

Rules:
- Use only facts you are given: the business name, category, city, address, rating, review count, founding year, hours and customer reviews. Never invent awards, prices, staff names, certifications, founding stories or statistics that aren't in the input.
- Where a detail isn't provided, write around it rather than making it up. Generic industry truths ("most leaks are found on the first visit") are fine; specific claims about this business are not, unless supported by the input.
- Testimonials must come from the supplied reviews. Keep the reviewer's own words and name; you may trim for length but never add praise that isn't there.
- Plain, confident language. No exclamation marks, no clichés like "look no further", "one-stop shop", "unparalleled" or "passion for excellence".
- Never output placeholder text, brackets, or instructions.`;

const TEMPLATE_VOICE: Record<TemplateId, string> = {
  legacy:
    "Voice: warm and story-led, like a well-written local newspaper profile. Lean on heritage and continuity — how long they've been here, what hasn't changed, what regulars come back for. The signature should be the one product or dish people associate with them.",
  modern:
    "Voice: clear, reassuring and practical. Customers are often stressed and on their phone. Lead with trust and speed. Short sentences. Headlines state the benefit plainly. Services explain exactly what's included.",
  bold:
    "Voice: confident, modern and a little playful, with personality but no slang. Short, punchy headlines with room to breathe. Write for a younger, design-conscious audience.",
};

function describeBusiness(business: Business): string {
  const niche = nicheByKey(business.niche);
  const reviews = business.reviews
    .map((r) => `<review author="${r.author}" rating="${r.rating}">${r.text}</review>`)
    .join("\n");
  return [
    `<business>`,
    `name: ${business.name}`,
    `category: ${business.category}`,
    `city: ${business.city}`,
    `address: ${business.address}`,
    `phone: ${business.phone}`,
    `rating: ${business.rating} from ${business.reviewCount} reviews`,
    business.yearEstablished ? `established: ${business.yearEstablished}` : null,
    business.hours ? `hours: ${business.hours}` : null,
    `typical services for this category (adapt, don't copy): ${niche.services.map((s) => s.name).join(", ")}`,
    `</business>`,
    `<reviews>\n${reviews || "No review text available."}\n</reviews>`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function structured<T extends z.ZodType>(schema: T, system: string, prompt: string, maxTokens: number): Promise<z.infer<T>> {
  try {
    const response = await claude().beta.messages.parse({
      model: MODEL,
      max_tokens: maxTokens,
      betas: [FALLBACK_BETA],
      fallbacks: "default",
      output_config: { effort: "medium", format: betaZodOutputFormat(schema) },
      system,
      messages: [{ role: "user", content: prompt }],
    });
    if (response.stop_reason === "refusal") {
      throw new GenerationError("The AI declined to write copy for this business. Try a different template.", false);
    }
    if (response.stop_reason === "max_tokens" || !response.parsed_output) {
      throw new GenerationError("The AI returned an incomplete result. Try again.", true);
    }
    return response.parsed_output as z.infer<T>;
  } catch (error) {
    throw toGenerationError(error);
  }
}

export async function generateSiteCopy(
  business: Business,
  templateId: TemplateId,
): Promise<{ copy: SiteCopy; source: CopySource }> {
  if (!hasClaudeCredentials()) {
    return { copy: offlineSiteCopy(business, templateId), source: "offline" };
  }

  const template = TEMPLATES[templateId];
  const prompt = `Write the copy for a one-page website for this business, using the "${template.name}" template.

${TEMPLATE_VOICE[templateId]}

${describeBusiness(business)}

Fill every field. Provide 2 story paragraphs, 3–4 services, exactly 3 highlights and 2–3 testimonials. The meta title should be under 60 characters and the meta description under 155.`;

  const copy = await structured(SiteCopySchema, COPYWRITER_SYSTEM, prompt, 16000);
  return { copy, source: "claude" };
}

const OUTREACH_SYSTEM = `You help freelance web designers write first-contact messages to local business owners. The designer has already built a draft website for the business and wants to show it to them.

Write like a real person reaching out to a neighbour's business: short, specific and respectful of their time. Reference the business by name and something true about it from the input (its reviews, rating or how long it has been around). Explain in one sentence what was built. Include the preview link exactly as given, on its own line. End with a low-pressure next step and sign off with the designer's first name.

Never use hype, exclamation marks, fake urgency, discounts, or phrases like "I hope this email finds you well", "game-changer" or "take your business to the next level".`;

export async function generateOutreach(input: {
  business: Business;
  operatorName: string;
  siteUrl: string;
  headline: string;
  templateId: TemplateId;
}): Promise<{ draft: OutreachDraft; source: CopySource }> {
  if (!hasClaudeCredentials()) {
    return { draft: offlineOutreach(input), source: "offline" };
  }

  const { business, operatorName, siteUrl, headline, templateId } = input;
  const prompt = `Write the outreach message.

${describeBusiness(business)}

<website_built>
template: ${TEMPLATES[templateId].name}
headline: ${headline}
preview link: ${siteUrl}
their current web presence: ${business.websiteStatus === "none" ? "no website at all" : `a weak website (${business.websiteUrl ?? "a basic page builder site"})`}
</website_built>

<designer>
name: ${operatorName}
</designer>`;

  const draft = await structured(OutreachSchema, OUTREACH_SYSTEM, prompt, 8000);
  return { draft, source: "claude" };
}
