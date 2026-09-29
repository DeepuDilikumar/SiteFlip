"use client";

import { useOptimistic, useTransition } from "react";
import { CaretDown } from "@phosphor-icons/react/ssr";
import { updateLeadStatus } from "@/actions/leads";
import { cn } from "@/lib/cn";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/types";

const DOT: Record<LeadStatus, string> = {
  generated: "bg-ink-3",
  contacted: "bg-warn",
  closed: "bg-accent",
};

export function StatusSelect({ leadId, status, businessName }: { leadId: string; status: LeadStatus; businessName: string }) {
  const [optimistic, setOptimistic] = useOptimistic(status);
  const [pending, startTransition] = useTransition();

  return (
    <div className={cn("relative inline-flex items-center", pending && "opacity-70")}>
      <span className={cn("pointer-events-none absolute left-3 size-1.5 rounded-full", DOT[optimistic])} aria-hidden="true" />
      <select
        aria-label={`Status for ${businessName}`}
        value={optimistic}
        onChange={(event) => {
          const next = event.target.value as LeadStatus;
          startTransition(async () => {
            setOptimistic(next);
            await updateLeadStatus(leadId, next);
          });
        }}
        className="h-8 cursor-pointer appearance-none rounded-lg bg-surface pr-8 pl-7 text-[13px] font-medium text-ink shadow-card outline-none transition-shadow hover:shadow-[0_0_0_1px_var(--color-line-strong)] focus-visible:shadow-[0_0_0_1px_var(--color-accent),0_0_0_4px_var(--color-accent-soft)]"
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <CaretDown size={12} className="pointer-events-none absolute right-3 text-ink-3" aria-hidden="true" />
    </div>
  );
}
