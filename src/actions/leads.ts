"use server";

import { revalidatePath } from "next/cache";
import { leads } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/types";

export async function updateLeadStatus(leadId: string, status: LeadStatus): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user || !LEAD_STATUSES.some((s) => s.value === status)) return { ok: false };
  const updated = await leads.update(leadId, user.id, { status });
  revalidatePath("/dashboard");
  return { ok: Boolean(updated) };
}
