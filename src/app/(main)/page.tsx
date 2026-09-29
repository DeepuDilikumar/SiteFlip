import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { ButtonLink } from "@/components/ui/button";
import { BeforeAfter } from "@/components/marketing/before-after";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/marketing-header";
import { TemplateThumb } from "@/components/app/template-thumb";
import { TEMPLATES, TEMPLATE_IDS } from "@/templates";

const STEPS = [
  {
    title: "Find",
    body: "Search any niche in any city. You only see businesses with no website, or one that's hurting them.",
  },
  {
    title: "Generate",
    body: "Pick a template. Claude writes specific copy from their listing and real reviews — no lorem ipsum, no placeholders.",
  },
  {
    title: "Close",
    body: "Send a live link and a short, personal message. Export the code or point their domain at it when they say yes.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <MarketingHeader />
      <main id="main" className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24">
          <h1 className="max-w-4xl font-display text-[44px] leading-[1.02] tracking-tight sm:text-7xl">
            Find businesses without websites. Generate a premium site in 90&nbsp;seconds.{" "}
            <em className="text-ink-2">Close the client.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
            SiteFlip is the prospecting and production tool for people who sell websites to local businesses.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ButtonLink href="/signup" size="lg">
              Get started
              <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
            <span className="text-sm text-ink-3">First site free. No card required.</span>
          </div>

          <div className="mt-20">
            <BeforeAfter />
          </div>
        </section>

        <section className="border-t border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="font-display text-4xl tracking-tight">How it works</h2>
            <ol className="mt-10 grid gap-10 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <li key={step.title}>
                  <p className="text-[13px] font-medium text-accent tabular-nums">0{i + 1}</p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-4xl tracking-tight">Three templates, three different characters</h2>
                <p className="mt-2 max-w-xl text-[15px] text-ink-2">
                  Not one layout in three colours. Each is built for a different kind of business — and every one is fast
                  and flawless on a phone.
                </p>
              </div>
            </div>
            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {TEMPLATE_IDS.map((id) => (
                <li key={id} className="overflow-hidden rounded-2xl bg-surface shadow-card">
                  <div className="h-40 border-b border-line">
                    <TemplateThumb id={id} />
                  </div>
                  <div className="p-5">
                    <h3 className="font-medium">{TEMPLATES[id].name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{TEMPLATES[id].bestFor}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-line bg-ink text-white">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 py-20 sm:px-6 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-2xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              There are businesses in your city with 200 reviews and no website. Go and find them.
            </h2>
            <div className="flex flex-col items-start gap-3">
              <ButtonLink href="/signup" size="lg" variant="secondary">
                Get started
                <ArrowRight size={16} aria-hidden="true" />
              </ButtonLink>
              <Link href="/pricing" className="rounded text-sm text-white/60 transition-colors hover:text-white">
                Compare plans
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
