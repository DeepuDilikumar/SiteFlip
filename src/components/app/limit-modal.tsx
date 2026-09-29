"use client";

import { Check } from "@phosphor-icons/react/ssr";
import { Modal } from "@/components/ui/modal";
import { Button, ButtonLink } from "@/components/ui/button";

const PRO_FEATURES = ["Unlimited site generations", "No SiteFlip badge", "Export code and a live deploy link", "AI outreach drafts for every lead"];

function nextResetLabel(now = new Date()): string {
  const reset = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", timeZone: "UTC" }).format(reset);
}

/** The single, calm upgrade prompt shown when a free user hits their limit. */
export function LimitModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="You've used your free generation this month"
      description={`Free accounts include one site a month; yours resets on ${nextResetLabel()}. Pro removes the limit.`}
    >
      <ul className="grid gap-2.5 rounded-xl bg-canvas p-4">
        {PRO_FEATURES.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-sm text-ink-2">
            <Check size={16} weight="bold" className="text-accent" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onClose}>
          Not now
        </Button>
        <ButtonLink href="/pricing">Upgrade to Pro</ButtonLink>
      </div>
    </Modal>
  );
}
