import type { SiteBusiness } from "./types";

export function initials(name: string): string {
  return name
    .replace(/[^A-Za-z0-9 &']/g, "")
    .split(/\s+/)
    .filter((word) => /^[A-Za-z0-9]/.test(word) && !["and", "&", "the", "co"].includes(word.toLowerCase()))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mapsHref(business: SiteBusiness): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.address}`)}`;
}

const STAR_PATH = "M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.8z";

function StarRow({ opacity }: { opacity?: number }) {
  return (
    <span style={{ display: "flex", gap: 2, opacity }}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" style={{ flex: "none" }}>
          <path fill="currentColor" d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
}

/** Five stars filled proportionally. Decorative — the number sits beside it. */
export function Stars({ rating, className }: { rating: number; className?: string }) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className={className} aria-hidden="true" style={{ position: "relative", display: "inline-flex" }}>
      <StarRow opacity={0.25} />
      <span style={{ position: "absolute", inset: 0, width: `${percent}%`, overflow: "hidden" }}>
        <StarRow />
      </span>
    </span>
  );
}

/** Shown on free-plan sites only. */
export function Watermark() {
  return (
    <a
      className="sf-watermark"
      href="https://siteflip.app"
      target="_blank"
      rel="noreferrer"
    >
      Built with SiteFlip
    </a>
  );
}
