import { BoldTemplate } from "./bold/Bold";
import { LegacyTemplate } from "./legacy/Legacy";
import { ModernTemplate } from "./modern/Modern";
import type { TemplateDefinition, TemplateId } from "./types";

/**
 * The template registry. To add a template: create `templates/<id>/` with a
 * component and `styles.css` (classes scoped under a unique prefix), import the
 * stylesheet in `app/(site)/layout.tsx`, and register it here.
 */
export const TEMPLATES: Record<TemplateId, TemplateDefinition> = {
  legacy: {
    id: "legacy",
    name: "Legacy",
    summary: "Warm and story-led. Opens with a hook, leads with the signature product, then the history behind it.",
    bestFor: "Established restaurants, bakeries, barbers — businesses with decades behind them.",
    fontsHref:
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Lora:ital,wght@0,400;0,600;1,400&display=swap",
    Component: LegacyTemplate,
  },
  modern: {
    id: "modern",
    name: "Modern Service",
    summary: "Trust signals first, tap-to-call everywhere. Clean, fast and built for customers on their phone.",
    bestFor: "Trades and professional services — plumbers, electricians, dentists, mechanics.",
    fontsHref: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
    Component: ModernTemplate,
  },
  bold: {
    id: "bold",
    name: "Bold",
    summary: "Confident typography and generous whitespace. More visual, more personality.",
    bestFor: "Design-forward cafés, boutiques, salons and studios with a younger crowd.",
    fontsHref:
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=Inter:wght@400;500;600&display=swap",
    Component: BoldTemplate,
  },
};

export const TEMPLATE_IDS = Object.keys(TEMPLATES) as TemplateId[];

export function isTemplateId(value: unknown): value is TemplateId {
  return typeof value === "string" && value in TEMPLATES;
}

export function getTemplate(id: string): TemplateDefinition {
  return isTemplateId(id) ? TEMPLATES[id] : TEMPLATES.modern;
}

export type { SiteBusiness, SiteCopy, TemplateId, TemplateProps } from "./types";
