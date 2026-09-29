import "server-only";
import { users } from "./db";
import { PLAN_LIMITS, currentPeriod, generationsUsed } from "./entitlements";

/**
 * Reserve one generation before calling the AI, and release it if generation
 * fails — so a failed attempt never costs the operator their free site.
 */
export async function reserveGeneration(userId: string): Promise<boolean> {
  const result = await users.mutate(userId, (user) => {
    const limit = PLAN_LIMITS[user.plan].generationsPerMonth;
    const used = generationsUsed(user);
    if (limit !== null && used >= limit) return false;
    user.usagePeriod = currentPeriod();
    user.generationsThisPeriod = used + 1;
    return true;
  });
  return result === true;
}

export async function releaseGeneration(userId: string): Promise<void> {
  await users.mutate(userId, (user) => {
    if (user.usagePeriod === currentPeriod() && user.generationsThisPeriod > 0) {
      user.generationsThisPeriod -= 1;
    }
  });
}
