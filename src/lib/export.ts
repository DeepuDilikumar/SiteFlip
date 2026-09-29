import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import JSZip from "jszip";
import { getTemplate } from "@/templates";
import { STATIC_MOTION_CSS, STATIC_MOTION_SCRIPT, staticKit } from "@/templates/kit/static";
import { slug } from "./random";
import { toSiteBusiness } from "./sites";
import type { Business, Site } from "./types";

const TEMPLATES_DIR = path.join(process.cwd(), "src", "templates");

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Renders a site to standalone HTML, CSS and JS with no framework dependency. */
async function renderStaticSite(site: Site, business: Business) {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const template = getTemplate(site.templateId);

  const body = renderToStaticMarkup(
    createElement(template.Component, {
      business: toSiteBusiness(business),
      copy: site.copy,
      kit: staticKit,
      watermark: false, // Export is Pro-only, and Pro sites carry no badge.
    }),
  );

  const [baseCss, templateCss] = await Promise.all([
    fs.readFile(path.join(TEMPLATES_DIR, "base.css"), "utf8"),
    fs.readFile(path.join(TEMPLATES_DIR, template.id, "styles.css"), "utf8"),
  ]);

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(site.copy.meta.title)}</title>
<meta name="description" content="${escapeHtml(site.copy.meta.description)}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="${template.fontsHref}" />
<link rel="stylesheet" href="styles.css" />
<noscript><style>[data-sf-reveal]{opacity:1!important;transform:none!important}</style></noscript>
</head>
<body style="margin:0">
${body}
<script src="site.js" defer></script>
</body>
</html>
`;

  return {
    html,
    css: `${baseCss}\n${templateCss}\n${STATIC_MOTION_CSS}\n`,
    js: `${STATIC_MOTION_SCRIPT}\n`,
  };
}

export async function buildSiteZip(site: Site, business: Business): Promise<{ filename: string; data: Uint8Array }> {
  const { html, css, js } = await renderStaticSite(site, business);
  const zip = new JSZip();
  const folder = zip.folder(slug(business.name) || "site")!;
  folder.file("index.html", html);
  folder.file("styles.css", css);
  folder.file("site.js", js);
  folder.file(
    "README.md",
    `# ${business.name}

A static website — no build step, no dependencies.

- Open \`index.html\` in a browser to preview it.
- To publish, drag this folder into Netlify Drop (https://app.netlify.com/drop),
  or upload it to any static host (Vercel, Cloudflare Pages, S3, shared hosting).

Files:
- \`index.html\` — the page
- \`styles.css\` — all styles
- \`site.js\` — scroll reveals and parallax (respects reduced-motion settings)
`,
  );
  const data = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
  return { filename: `${slug(business.name) || "site"}.zip`, data };
}
