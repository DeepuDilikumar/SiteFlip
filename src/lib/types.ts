import type { SiteCopy } from "@/templates/types";

export type Plan = "free" | "pro";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  plan: Plan;
  /** Calendar month ("YYYY-MM") the generation counter applies to. */
  usagePeriod: string;
  generationsThisPeriod: number;
  createdAt: string;
}

export type WebsiteStatus = "none" | "weak";

export interface Review {
  author: string;
  rating: number;
  text: string;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  /** Niche key used to pick copy and imagery defaults, e.g. "plumber". */
  niche: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
  reviewCount: number;
  websiteStatus: WebsiteStatus;
  websiteUrl?: string;
  yearEstablished?: number;
  hours?: string;
  reviews: Review[];
}

export type LeadStatus = "generated" | "contacted" | "closed";

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "generated", label: "Site ready" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

/** A business the operator has built a site for, tracked on their dashboard. */
export interface Lead {
  id: string;
  userId: string;
  businessId: string;
  siteId: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export type CopySource = "claude" | "offline";

export interface Site {
  id: string;
  userId: string;
  businessId: string;
  templateId: string;
  copy: SiteCopy;
  copySource: CopySource;
  createdAt: string;
}
