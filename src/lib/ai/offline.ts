import type { Business } from "@/lib/types";
import { nicheByKey } from "@/lib/niches";
import { seededRandom, pick } from "@/lib/random";
import type { SiteCopy, TemplateId } from "@/templates/types";
import type { OutreachDraft } from "./schemas";

/**
 * Deterministic copywriter used when no Claude credentials are configured.
 * Everything is assembled from the business's real data and niche knowledge,
 * so the output is specific — never placeholder text.
 */
export function offlineSiteCopy(business: Business, templateId: TemplateId): SiteCopy {
  const niche = nicheByKey(business.niche);
  const rand = seededRandom(`${business.id}|${templateId}`);
  const years = business.yearEstablished ? new Date().getFullYear() - business.yearEstablished : null;
  const place = business.city;

  const headlines: Record<TemplateId, string[]> = {
    legacy: years
      ? [`${years} years of ${niche.signature.name.toLowerCase()} in ${place}`, `${place}'s ${niche.category.toLowerCase()} since ${business.yearEstablished}`]
      : [`The ${niche.category.toLowerCase()} ${place} keeps coming back to`, `Made the way it always has been`],
    modern: [
      `${place}'s trusted ${niche.category.toLowerCase()}, on call when you need us`,
      `Fast, honest ${niche.category.toLowerCase()} service in ${place}`,
    ],
    bold: [`${niche.signature.name}, done properly`, `Your new favourite spot in ${place}`],
  };

  const taglines: Record<TemplateId, string> = {
    legacy: years ? `Family run since ${business.yearEstablished}` : `A ${place} favourite`,
    modern: `Rated ${business.rating.toFixed(1)} by ${business.reviewCount} neighbours`,
    bold: `${niche.category} · ${place}`,
  };

  const reviewLine = business.reviews[0]?.text;

  return {
    tagline: taglines[templateId],
    headline: pick(rand, headlines[templateId]),
    subheadline: `${business.name} is a ${niche.category.toLowerCase()} in ${place} with a ${business.rating.toFixed(1)}-star rating across ${business.reviewCount} reviews. ${niche.signature.description}`,
    signature: niche.signature,
    story: {
      heading: years ? `${years} years on ${streetOf(business.address)}` : `Built on word of mouth`,
      paragraphs: [
        years
          ? `${business.name} opened its doors in ${business.yearEstablished}, and a lot of the people who walked in that first year still do. The business has grown, but the way the work gets done hasn't changed.`
          : `${business.name} didn't grow through advertising. It grew one customer at a time, through people telling their friends where to go.`,
        reviewLine
          ? `It shows in what customers say — reviews like “${trimQuote(reviewLine, 110)}” are the reason ${business.reviewCount} people have taken the time to leave a rating.`
          : `That reputation is the reason ${business.reviewCount} people have taken the time to leave a rating.`,
      ],
    },
    services: niche.services,
    highlights: niche.trustPoints,
    testimonials: business.reviews.slice(0, 3).map((r) => ({ quote: trimQuote(r.text, 220), author: r.author })),
    cta: {
      heading: templateId === "modern" ? "Need help today?" : `Come and see us`,
      body:
        templateId === "modern"
          ? `Call ${business.name} and speak to a real person. ${business.hours ?? ""}`.trim()
          : `Find us at ${business.address}.${business.hours ? ` Open ${business.hours}.` : ""}`,
      buttonLabel: niche.ctaVerb,
    },
    meta: {
      title: `${business.name} · ${niche.category} in ${place}`,
      description: `${business.name} — ${niche.category.toLowerCase()} in ${place}. Rated ${business.rating.toFixed(1)} from ${business.reviewCount} reviews. ${niche.signature.description}`,
    },
  };
}

export function offlineOutreach(input: { business: Business; operatorName: string; siteUrl: string; headline: string }): OutreachDraft {
  const { business, operatorName, siteUrl, headline } = input;
  const first = operatorName.split(" ")[0] || operatorName;
  return {
    subject: `A website for ${business.name}`,
    message: [
      `Hi there,`,
      ``,
      `I came across ${business.name} while looking at ${business.category.toLowerCase()}s in ${business.city} — ${business.reviewCount} reviews at ${business.rating.toFixed(1)} stars is a real reputation, but ${business.websiteStatus === "none" ? "I couldn't find a website for you" : "your current site doesn't do it justice"}.`,
      ``,
      `So I put together a draft to show what one could look like. It leads with “${headline}” and pulls in what your customers already say about you:`,
      siteUrl,
      ``,
      `No obligation — if you like it, I can have it live on your own domain within a week. Happy to answer any questions.`,
      ``,
      `Best,`,
      first,
    ].join("\n"),
  };
}

function streetOf(address: string): string {
  return address.split(",")[0].replace(/^\d+\s+/, "");
}

function trimQuote(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
