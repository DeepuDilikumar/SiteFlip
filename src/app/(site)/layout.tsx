import type { Viewport } from "next";
import "@/templates/base.css";
import "@/templates/legacy/styles.css";
import "@/templates/modern/styles.css";
import "@/templates/bold/styles.css";

/**
 * Root layout for generated sites. Deliberately separate from the app's
 * layout: no app CSS or fonts leak in, so what renders here matches the
 * exported code exactly.
 */
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
