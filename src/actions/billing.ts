"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { completeStubCheckout, downgradeToFree } from "@/lib/billing";
import { getCurrentUser } from "@/lib/auth/session";

export type CheckoutState = { error?: string };

export async function checkout(): Promise<CheckoutState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/checkout");
  if (user.plan === "pro") redirect("/dashboard");

  const result = await completeStubCheckout(user.id);
  if (!result.ok) return { error: result.error ?? "Payment didn't go through. Try again." };

  // The plan shows in the shared app header, so refresh layouts, not just the page.
  revalidatePath("/", "layout");
  redirect("/dashboard?upgraded=1");
}

export async function cancelPro(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/pricing");
  await downgradeToFree(user.id);
  revalidatePath("/", "layout");
  redirect("/pricing");
}
