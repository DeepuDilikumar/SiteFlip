import "server-only";
import { randomUUID } from "node:crypto";
import { generateSiteCopy } from "./ai/generate";
import { GenerationError } from "./ai/client";
import { businesses, leads, sites } from "./db";
import { releaseGeneration, reserveGeneration } from "./usage";
import type { Business, Site, User } from "./types";
import type { SiteBusiness, TemplateId } from "@/templates/types";

export class LimitReachedError extends Error {
  constructor() {
    super("Free plan generation limit reached.");
    this.name = "LimitReachedError";
  }
}

export class NotFoundError extends Error {
  constructor(what: string) {
    super(`${what} not found.`);
    this.name = "NotFoundError";
  }
}

/** Generates copy, stores the site, and adds the business to the pipeline. */
export async function createSite(user: User, businessId: string, templateId: TemplateId): Promise<Site> {
  const business = await businesses.findById(businessId);
  if (!business) throw new NotFoundError("Business");

  if (!(await reserveGeneration(user.id))) throw new LimitReachedError();

  let site: Site;
  try {
    const { copy, source } = await generateSiteCopy(business, templateId);
    site = await sites.create({
      id: `site_${randomUUID().replaceAll("-", "").slice(0, 16)}`,
      userId: user.id,
      businessId,
      templateId,
      copy,
      copySource: source,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    await releaseGeneration(user.id);
    throw error instanceof GenerationError ? error : new GenerationError("Something went wrong while generating. Try again.", true, { cause: error });
  }

  const now = new Date().toISOString();
  await leads.upsert({
    id: `lead_${randomUUID().replaceAll("-", "").slice(0, 16)}`,
    userId: user.id,
    businessId,
    siteId: site.id,
    status: "generated",
    createdAt: now,
    updatedAt: now,
  });

  return site;
}

/** Loads a site plus its business. Callers are responsible for access checks. */
export async function loadSite(siteId: string): Promise<{ site: Site; business: Business } | null> {
  const site = await sites.findById(siteId);
  if (!site) return null;
  const business = await businesses.findById(site.businessId);
  return business ? { site, business } : null;
}

export function toSiteBusiness(business: Business): SiteBusiness {
  return {
    name: business.name,
    category: business.category,
    address: business.address,
    city: business.city,
    phone: business.phone,
    rating: business.rating,
    reviewCount: business.reviewCount,
    hours: business.hours,
    yearEstablished: business.yearEstablished,
  };
}
