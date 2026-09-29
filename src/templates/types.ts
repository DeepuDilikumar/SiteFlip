import type { ComponentType, ReactNode } from "react";
import { z } from "zod";

/**
 * The copy every template renders. It doubles as the structured-output schema
 * Claude fills in, so adding a field here is the only change needed to make it
 * available to both the generator and every template.
 */
export const SiteCopySchema = z.object({
  tagline: z.string().describe("A short eyebrow line above the headline, 2–6 words."),
  headline: z.string().describe("The hero headline. Specific to this business, under 10 words."),
  subheadline: z.string().describe("One or two sentences expanding on the headline."),
  signature: z
    .object({ name: z.string(), description: z.string() })
    .describe("The one product, dish or service this business is known for."),
  story: z.object({
    heading: z.string(),
    paragraphs: z.array(z.string()).describe("Two short paragraphs telling the business's story."),
  }),
  services: z
    .array(z.object({ name: z.string(), description: z.string() }))
    .describe("Three or four core services, each with a one-sentence description."),
  highlights: z
    .array(z.object({ title: z.string(), detail: z.string() }))
    .describe("Three trust signals, e.g. 'Licensed & insured' with a short supporting detail."),
  testimonials: z
    .array(z.object({ quote: z.string(), author: z.string() }))
    .describe("Two or three testimonials drawn from the supplied reviews, lightly edited for length."),
  cta: z.object({
    heading: z.string(),
    body: z.string(),
    buttonLabel: z.string().describe("2–4 words, e.g. 'Book a table'."),
  }),
  meta: z.object({ title: z.string(), description: z.string() }),
});

export type SiteCopy = z.infer<typeof SiteCopySchema>;

export type TemplateId = "legacy" | "modern" | "bold";

/** Just the business facts a template needs — no internal fields. */
export interface SiteBusiness {
  name: string;
  category: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
  reviewCount: number;
  hours?: string;
  yearEstablished?: number;
}

export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds. Use small values (≤0.3) to stagger siblings. */
  delay?: number;
}

export interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Pixels of travel across the element's time in view. */
  distance?: number;
}

/**
 * Templates stay server-compatible and receive motion as components: Framer
 * Motion in the live preview, dependency-free equivalents in exported code.
 */
export interface MotionKit {
  Reveal: ComponentType<RevealProps>;
  Parallax: ComponentType<ParallaxProps>;
}

export interface TemplateProps {
  business: SiteBusiness;
  copy: SiteCopy;
  kit: MotionKit;
  watermark: boolean;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  summary: string;
  bestFor: string;
  /** Google Fonts stylesheet the template depends on. */
  fontsHref: string;
  Component: ComponentType<TemplateProps>;
}
