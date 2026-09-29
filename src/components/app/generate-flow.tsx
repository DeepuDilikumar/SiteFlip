"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowClockwise, Check, Sparkle, WarningCircle } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/cn";
import type { ApiError } from "@/lib/http";
import type { TemplateId } from "@/templates/types";
import { LimitModal } from "./limit-modal";
import { TemplateThumb } from "./template-thumb";

export type TemplateOption = { id: TemplateId; name: string; summary: string; bestFor: string };

type Props = {
  businessId: string;
  businessName: string;
  category: string;
  reviewCount: number;
  templates: TemplateOption[];
  recommended: TemplateId;
  canGenerate: boolean;
  rebuilding: boolean;
};

type Phase = { kind: "choose" } | { kind: "generating" } | { kind: "error"; message: string; retryable: boolean };

export function GenerateFlow(props: Props) {
  const { businessId, templates, recommended, canGenerate } = props;
  const router = useRouter();
  const [templateId, setTemplateId] = useState<TemplateId>(recommended);
  const [phase, setPhase] = useState<Phase>({ kind: "choose" });
  const [limitOpen, setLimitOpen] = useState(false);

  async function generate() {
    if (!canGenerate) {
      setLimitOpen(true);
      return;
    }
    setPhase({ kind: "generating" });
    try {
      const response = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, templateId }),
      });
      if (response.ok) {
        const { siteId } = (await response.json()) as { siteId: string };
        router.push(`/preview/${siteId}`);
        router.refresh(); // update usage shown in the header
        return;
      }
      const body = (await response.json().catch(() => null)) as ApiError | null;
      if (body?.code === "LIMIT_REACHED") {
        setPhase({ kind: "choose" });
        setLimitOpen(true);
        return;
      }
      setPhase({ kind: "error", message: body?.error ?? "Something went wrong while generating.", retryable: body?.retryable ?? true });
    } catch {
      setPhase({ kind: "error", message: "We lost the connection while generating. Check your network and try again.", retryable: true });
    }
  }

  const selected = templates.find((t) => t.id === templateId)!;

  if (phase.kind === "generating") {
    return <GeneratingState {...props} template={selected} />;
  }

  return (
    <>
      {phase.kind === "error" ? (
        <div role="alert" className="mb-6 flex flex-col gap-4 rounded-2xl bg-danger-soft p-5 sm:flex-row sm:items-center">
          <WarningCircle size={22} className="shrink-0 text-danger" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-medium text-ink">That generation didn&rsquo;t finish</p>
            <p className="mt-0.5 text-sm text-ink-2">{phase.message} It didn&rsquo;t count toward your usage.</p>
          </div>
          {phase.retryable ? (
            <Button variant="secondary" onClick={generate}>
              <ArrowClockwise size={16} aria-hidden="true" />
              Try again
            </Button>
          ) : null}
        </div>
      ) : null}

      <fieldset>
        <legend className="text-sm font-medium text-ink">Choose a template</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {templates.map((t) => {
            const active = t.id === templateId;
            return (
              <label
                key={t.id}
                className={cn(
                  "group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-surface transition-shadow duration-150",
                  active
                    ? "shadow-[0_0_0_2px_var(--color-ink),0_8px_24px_rgb(21_21_19/0.08)]"
                    : "shadow-card hover:shadow-[0_0_0_1px_var(--color-line-strong),0_4px_12px_rgb(21_21_19/0.05)]",
                )}
              >
                <input
                  type="radio"
                  name="template"
                  value={t.id}
                  checked={active}
                  onChange={() => setTemplateId(t.id)}
                  className="peer sr-only"
                />
                <div className="h-28 border-b border-line">
                  <TemplateThumb id={t.id} />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-ink">{t.name}</span>
                    <span
                      className={cn(
                        "grid size-5 place-items-center rounded-full transition-colors",
                        active ? "bg-ink text-white" : "shadow-[inset_0_0_0_1.5px_var(--color-line-strong)]",
                      )}
                      aria-hidden="true"
                    >
                      {active ? <Check size={12} weight="bold" /> : null}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{t.summary}</p>
                  {t.id === recommended ? (
                    <p className="mt-3 text-[12px] font-medium text-accent">Recommended</p>
                  ) : null}
                </div>
                <span className="pointer-events-none absolute inset-0 rounded-2xl peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent" />
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="sticky bottom-0 -mx-4 mt-8 border-t border-line bg-canvas/90 px-4 py-4 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-ink-3">{selected.bestFor}</p>
          <Button size="lg" onClick={generate} className="w-full sm:w-auto">
            <Sparkle size={18} weight="fill" aria-hidden="true" />
            {props.rebuilding ? "Generate a new version" : "Generate site"}
          </Button>
        </div>
      </div>

      <LimitModal open={limitOpen} onClose={() => setLimitOpen(false)} />
    </>
  );
}

const STEP_DELAYS_MS = [0, 2500, 7000, 13000];

function GeneratingState({ businessName, reviewCount, template }: Props & { template: TemplateOption }) {
  const steps = [
    `Reading ${businessName}'s reviews`,
    "Writing the headline and story",
    "Describing their services",
    `Laying it out in ${template.name}`,
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timers = STEP_DELAYS_MS.slice(1).map((delay, i) => setTimeout(() => setActive(i + 1), delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="grid animate-fade-in gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center" aria-live="polite">
      <div>
        <h2 className="font-display text-3xl tracking-tight">Building {businessName}&rsquo;s site</h2>
        <p className="mt-2 text-sm text-ink-2">
          Using {reviewCount} reviews and their listing details. This usually takes under a minute.
        </p>
        <ol className="mt-8 grid gap-4">
          {steps.map((step, i) => {
            const done = i < active;
            const current = i === active;
            return (
              <li key={step} className={cn("flex items-center gap-3 text-sm transition-colors", done || current ? "text-ink" : "text-ink-3")}>
                <span className="grid size-6 shrink-0 place-items-center">
                  {done ? (
                    <span className="grid size-5 place-items-center rounded-full bg-accent text-white">
                      <Check size={11} weight="bold" aria-hidden="true" />
                    </span>
                  ) : current ? (
                    <Spinner className="size-4 text-accent" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-line-strong" aria-hidden="true" />
                  )}
                </span>
                {step}
              </li>
            );
          })}
        </ol>
      </div>

      {/* A browser frame with a skeleton of the chosen template. */}
      <div className="overflow-hidden rounded-2xl bg-surface shadow-raised" aria-hidden="true">
        <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="skeleton ml-4 h-5 flex-1 rounded-md" />
        </div>
        <div className="relative h-72 sm:h-80">
          <div className="absolute inset-0 opacity-40 blur-[1px]">
            <TemplateThumb id={template.id} />
          </div>
          <div className="absolute inset-0 space-y-3 p-8">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-8 w-4/5" />
            <div className="skeleton h-8 w-3/5" />
            <div className="skeleton h-3 w-2/3" />
            <div className="skeleton mt-6 h-10 w-36 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
