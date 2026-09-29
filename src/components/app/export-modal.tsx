"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowSquareOut, ArrowClockwise, Check, Copy, DownloadSimple, PaperPlaneTilt } from "@phosphor-icons/react/ssr";
import { Modal } from "@/components/ui/modal";
import { Button, buttonClasses } from "@/components/ui/button";
import type { ApiError } from "@/lib/http";
import { useCopy } from "./use-copy";

type Props = { open: boolean; onClose: () => void; siteId: string; siteUrl: string; businessName: string };

type Outreach =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "ready"; subject: string; message: string }
  | { state: "error"; message: string; retryable: boolean };

/**
 * Export and outreach share one modal: the operator's next step after
 * exporting is almost always contacting the business, so it's one click on.
 */
export function ExportModal({ open, onClose, siteId, siteUrl, businessName }: Props) {
  const [view, setView] = useState<"export" | "outreach">("export");
  const [outreach, setOutreach] = useState<Outreach>({ state: "idle" });

  function close() {
    onClose();
    setView("export");
  }

  async function draftOutreach() {
    setView("outreach");
    if (outreach.state === "ready" || outreach.state === "loading") return;
    setOutreach({ state: "loading" });
    try {
      const response = await fetch(`/api/sites/${siteId}/outreach`, { method: "POST" });
      const body = await response.json().catch(() => null);
      if (response.ok) {
        setOutreach({ state: "ready", subject: body.subject, message: body.message });
      } else {
        const error = body as ApiError | null;
        setOutreach({ state: "error", message: error?.error ?? "We couldn't draft a message.", retryable: error?.retryable ?? true });
      }
    } catch {
      setOutreach({ state: "error", message: "We lost the connection. Check your network and try again.", retryable: true });
    }
  }

  if (view === "outreach") {
    return (
      <Modal
        open={open}
        onClose={close}
        title="Outreach message"
        description={`A short, specific note to ${businessName}. Edit anything before you send it.`}
        size="lg"
      >
        <OutreachView outreach={outreach} onRetry={() => { setOutreach({ state: "idle" }); void draftOutreach(); }} onBack={() => setView("export")} />
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={close} title="Export site" description={`Everything you need to hand ${businessName} their new site.`}>
      <div className="grid gap-3">
        <LiveLink url={siteUrl} />
        <div className="flex items-center justify-between gap-4 rounded-xl bg-canvas p-4">
          <div>
            <p className="text-sm font-medium">Source code</p>
            <p className="mt-0.5 text-[13px] text-ink-3">HTML, CSS and JS. No build step.</p>
          </div>
          <a href={`/api/sites/${siteId}/export`} download className={buttonClasses({ variant: "secondary", size: "sm" })}>
            <DownloadSimple size={14} aria-hidden="true" />
            Download .zip
          </a>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse gap-2 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-ink-3">Next: let them know it exists.</p>
        <Button onClick={draftOutreach}>
          <PaperPlaneTilt size={16} aria-hidden="true" />
          Draft outreach message
        </Button>
      </div>
    </Modal>
  );
}

function LiveLink({ url }: { url: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="rounded-xl bg-canvas p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium">Live link</p>
          <p className="mt-0.5 truncate text-[13px] text-ink-3">{url}</p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <a href={url} target="_blank" rel="noreferrer" aria-label="Open live site in a new tab" className={buttonClasses({ variant: "ghost", size: "sm", className: "w-8 px-0" })}>
            <ArrowSquareOut size={15} aria-hidden="true" />
          </a>
          <Button variant="secondary" size="sm" onClick={() => copy(url)}>
            {copied ? <Check size={14} weight="bold" className="text-accent" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
            <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-ink-3">Hosted and ready to share. Point their domain here once they say yes.</p>
    </div>
  );
}

function OutreachView({ outreach, onRetry, onBack }: { outreach: Outreach; onRetry: () => void; onBack: () => void }) {
  const { copied, copy } = useCopy(4000);
  const [edited, setEdited] = useState<string | null>(null);

  if (outreach.state === "loading" || outreach.state === "idle") {
    return (
      <div aria-busy="true" aria-live="polite">
        <span className="sr-only">Drafting your message…</span>
        <div className="skeleton h-4 w-1/2" />
        <div className="mt-5 space-y-2.5 rounded-xl bg-canvas p-4">
          {[92, 100, 84, 96, 60].map((w, i) => (
            <div key={i} className="skeleton h-3" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (outreach.state === "error") {
    return (
      <div role="alert">
        <p className="rounded-xl bg-danger-soft p-4 text-sm text-danger">{outreach.message}</p>
        <div className="mt-6 flex justify-between gap-2">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft size={14} aria-hidden="true" /> Back
          </Button>
          {outreach.retryable ? (
            <Button onClick={onRetry}>
              <ArrowClockwise size={14} aria-hidden="true" /> Try again
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  const message = edited ?? outreach.message;
  return (
    <div>
      <p className="text-[13px] text-ink-3">
        Subject: <span className="font-medium text-ink">{outreach.subject}</span>
      </p>
      <label htmlFor="outreach-message" className="sr-only">
        Message
      </label>
      <textarea
        id="outreach-message"
        value={message}
        onChange={(event) => setEdited(event.target.value)}
        rows={12}
        className="mt-3 w-full resize-y rounded-xl bg-canvas p-4 text-sm leading-relaxed text-ink outline-none transition-shadow focus:shadow-[0_0_0_1px_var(--color-accent),0_0_0_4px_var(--color-accent-soft)]"
      />
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={14} aria-hidden="true" /> Back
        </Button>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          {copied ? (
            <Link href="/dashboard" className={buttonClasses({ variant: "secondary" })}>
              Back to dashboard
            </Link>
          ) : null}
          <Button onClick={() => copy(`Subject: ${outreach.subject}\n\n${message}`)}>
            {copied ? <Check size={16} weight="bold" aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            <span aria-live="polite">{copied ? "Copied to clipboard" : "Copy message"}</span>
          </Button>
        </div>
      </div>
      {copied ? (
        <p className="mt-4 animate-fade-in text-[13px] text-ink-3">Once it&rsquo;s sent, mark them as Contacted on your dashboard.</p>
      ) : null}
    </div>
  );
}
