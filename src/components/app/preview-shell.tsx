"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, DesktopTower, DeviceMobile, Export, LockSimple, Plus } from "@phosphor-icons/react/ssr";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { Entitlements } from "@/lib/entitlements";
import { ExportModal } from "./export-modal";
import { LimitModal } from "./limit-modal";

type Props = {
  siteId: string;
  siteUrl: string;
  businessName: string;
  templateName: string;
  entitlements: Entitlements;
  offlineCopy: boolean;
};

export function PreviewShell({ siteId, siteUrl, businessName, templateName, entitlements, offlineCopy }: Props) {
  const router = useRouter();
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Start loading the site only once this page has mounted. An iframe that loads during
  // hydration can stay render-throttled in Chrome, which freezes the site's animations.
  useEffect(() => {
    if (frameRef.current) frameRef.current.src = `/sites/${siteId}`;
  }, [siteId]);
  const [exportOpen, setExportOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);

  function generateAnother() {
    if (entitlements.canGenerate) router.push("/find");
    else setLimitOpen(true);
  }

  return (
    <div className="flex h-dvh flex-col bg-sunken">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-3 sm:px-4">
        <Link
          href="/dashboard"
          aria-label="Back to dashboard"
          className="grid size-9 shrink-0 place-items-center rounded-lg text-ink-2 transition-colors hover:bg-sunken hover:text-ink"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-medium">{businessName}</h1>
          <p className="truncate text-[12px] text-ink-3">
            {templateName}
            {entitlements.showWatermark ? " · Private preview" : ""}
          </p>
        </div>

        <div role="group" aria-label="Preview size" className="hidden rounded-lg bg-sunken p-0.5 md:flex">
          {(["desktop", "mobile"] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={device === d}
              aria-label={d === "desktop" ? "Desktop preview" : "Mobile preview"}
              onClick={() => setDevice(d)}
              className={cn(
                "grid h-8 w-9 cursor-pointer place-items-center rounded-md transition-[background-color,color,box-shadow]",
                device === d ? "bg-surface text-ink shadow-card" : "text-ink-3 hover:text-ink",
              )}
            >
              {d === "desktop" ? <DesktopTower size={16} aria-hidden="true" /> : <DeviceMobile size={16} aria-hidden="true" />}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" onClick={generateAnother} className="hidden sm:inline-flex">
            <Plus size={16} aria-hidden="true" />
            Generate another site
          </Button>
          {entitlements.canExport ? (
            <Button onClick={() => setExportOpen(true)}>
              <Export size={16} aria-hidden="true" />
              Export site
            </Button>
          ) : (
            <ButtonLink href="/pricing">
              <LockSimple size={16} aria-hidden="true" />
              Upgrade to export
            </ButtonLink>
          )}
        </div>
      </header>

      {offlineCopy ? (
        <p className="border-b border-line bg-surface px-4 py-2 text-center text-[12px] text-ink-3">
          Demo copy: set <code className="rounded bg-sunken px-1 py-0.5">ANTHROPIC_API_KEY</code> to have Claude write each site.
        </p>
      ) : null}

      <main id="main" className="relative flex-1 overflow-hidden p-0 md:p-6">
        <div
          className={cn(
            "relative mx-auto h-full overflow-hidden bg-surface transition-[max-width,border-radius] duration-300 ease-out md:rounded-xl md:shadow-raised",
            device === "mobile" ? "max-w-[390px]" : "max-w-full",
          )}
        >
          {/* Skeleton sits over the iframe rather than hiding it: Chrome treats a transparent
              iframe as not visible, so the site's scroll reveals would never fire. */}
          {!loaded ? (
            <div className="absolute inset-0 z-10 space-y-4 bg-surface p-10" aria-hidden="true">
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-12 w-2/3" />
              <div className="skeleton h-12 w-1/2" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          ) : null}
          <iframe
            ref={frameRef}
            title={`${businessName} website preview`}
            onLoad={(event) => event.currentTarget.src && setLoaded(true)}
            className="size-full border-0"
          />
        </div>
      </main>

      {/* Small screens: keep "Generate another" reachable without crowding the toolbar. */}
      <div className="border-t border-line bg-surface p-3 sm:hidden">
        <Button variant="secondary" onClick={generateAnother} className="w-full">
          <Plus size={16} aria-hidden="true" />
          Generate another site
        </Button>
      </div>

      {entitlements.canExport ? (
        <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} siteId={siteId} siteUrl={siteUrl} businessName={businessName} />
      ) : null}
      <LimitModal open={limitOpen} onClose={() => setLimitOpen(false)} />
    </div>
  );
}
