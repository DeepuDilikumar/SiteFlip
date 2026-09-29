import "server-only";
import { users } from "./db";

/**
 * ─── BILLING STUB ────────────────────────────────────────────────────────────
 * No payment provider is wired up yet. The plan change below is real — it
 * flips the user's plan, which every gated feature reads — but no money moves.
 *
 * To go live with Stripe:
 *   1. `createCheckout` → create a Checkout Session with the Pro price and
 *      return `session.url`; redirect the user there instead of /checkout.
 *   2. Add a webhook route for `checkout.session.completed` that calls
 *      `activatePro(userId)` (read the user id from session metadata).
 *   3. Handle `customer.subscription.deleted` by calling `downgradeToFree`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface CheckoutResult {
  ok: boolean;
  error?: string;
}

/** Placeholder: pretends the card was charged and activates Pro. */
export async function completeStubCheckout(userId: string): Promise<CheckoutResult> {
  await activatePro(userId);
  return { ok: true };
}

export async function activatePro(userId: string): Promise<void> {
  await users.update(userId, { plan: "pro" });
}

export async function downgradeToFree(userId: string): Promise<void> {
  await users.update(userId, { plan: "free" });
}
