import type { Plan, User } from "./types";

/**
 * Single source of truth for what each plan can do. Server code gates on
 * these functions; the UI receives the same answers via `entitlementsFor`
 * so it never re-derives plan logic on its own.
 */
export const PLAN_LIMITS: Record<Plan, { generationsPerMonth: number | null }> = {
  free: { generationsPerMonth: 1 },
  pro: { generationsPerMonth: null },
};

/** Editable placeholder price, shown on the pricing and checkout pages. */
export const PRO_PRICE_MONTHLY_USD = Number(process.env.NEXT_PUBLIC_PRO_PRICE_USD ?? 39);

export function currentPeriod(now = new Date()): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function generationsUsed(user: User, now = new Date()): number {
  return user.usagePeriod === currentPeriod(now) ? user.generationsThisPeriod : 0;
}

export function isPro(user: Pick<User, "plan">): boolean {
  return user.plan === "pro";
}

export interface Entitlements {
  plan: Plan;
  generationsUsed: number;
  /** null means unlimited. */
  generationsLimit: number | null;
  canGenerate: boolean;
  canExport: boolean;
  canDraftOutreach: boolean;
  showWatermark: boolean;
}

export function entitlementsFor(user: User, now = new Date()): Entitlements {
  const limit = PLAN_LIMITS[user.plan].generationsPerMonth;
  const used = generationsUsed(user, now);
  const pro = isPro(user);
  return {
    plan: user.plan,
    generationsUsed: used,
    generationsLimit: limit,
    canGenerate: limit === null || used < limit,
    canExport: pro,
    canDraftOutreach: pro,
    showWatermark: !pro,
  };
}
