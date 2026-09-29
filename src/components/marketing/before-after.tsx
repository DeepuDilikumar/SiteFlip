import { ArrowRight, GlobeX, MapPin, Phone, Star } from "@phosphor-icons/react/ssr";

/**
 * The landing page's proof: an unremarkable map listing next to the site
 * SiteFlip generates from it. Illustrative mock-ups, not screenshots.
 */
export function BeforeAfter() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[0.8fr_auto_1.2fr] lg:gap-8">
      <figure>
        <figcaption className="mb-3 text-[13px] font-medium text-ink-3">Before · their only listing</figcaption>
        <div className="overflow-hidden rounded-2xl bg-surface shadow-card" aria-hidden="true">
          <div className="relative h-28 bg-[#e9ece6]">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_48%,#fff_48%,#fff_52%,transparent_52%),linear-gradient(0deg,transparent_58%,#fff_58%,#fff_63%,transparent_63%)] opacity-80" />
            <div className="absolute top-[38%] left-[46%] grid size-7 place-items-center rounded-full bg-[#c5463a] text-white shadow-md">
              <MapPin size={14} weight="fill" />
            </div>
          </div>
          <div className="space-y-3 p-5">
            <div>
              <p className="font-medium text-ink">Rosa&rsquo;s Trattoria</p>
              <p className="mt-0.5 flex items-center gap-1 text-[13px] text-ink-3">
                4.8 <Star size={12} weight="fill" className="text-[#e5a00d]" /> (212) · Italian restaurant
              </p>
            </div>
            <div className="space-y-2 border-t border-line pt-3 text-[13px] text-ink-2">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-ink-3" /> 418 Mill Ln, Austin
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-ink-3" /> (512) 555-0148
              </p>
              <p className="flex items-center gap-2 text-ink-3">
                <GlobeX size={14} /> No website
              </p>
            </div>
          </div>
        </div>
      </figure>

      <div className="hidden self-center justify-center lg:flex" aria-hidden="true">
        <div className="grid size-10 place-items-center rounded-full bg-surface text-ink-2 shadow-card">
          <ArrowRight size={16} />
        </div>
      </div>

      <figure>
        <figcaption className="mb-3 text-[13px] font-medium text-ink-3">After · 90 seconds later</figcaption>
        <div className="overflow-hidden rounded-2xl bg-surface shadow-raised" aria-hidden="true">
          <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
            <span className="size-2 rounded-full bg-line-strong" />
            <span className="size-2 rounded-full bg-line-strong" />
            <span className="size-2 rounded-full bg-line-strong" />
            <span className="ml-3 truncate rounded-md bg-sunken px-3 py-1 text-[11px] text-ink-3">rosastrattoria.com</span>
          </div>
          <div className="bg-[#f6f0e6] text-[#2b211a]">
            <div className="flex items-center justify-between border-b border-[#ddcfbc] px-6 py-3 text-[11px]">
              <span className="font-display text-base">Rosa&rsquo;s Trattoria</span>
              <span className="hidden gap-4 text-[#5e4f43] sm:flex">
                <span>Our story</span>
                <span>Menu</span>
                <span>Visit</span>
              </span>
            </div>
            <div className="grid grid-cols-[1.4fr_1fr] items-center gap-4 px-6 py-8 sm:py-10">
              <div>
                <p className="text-[11px] text-[#8f4127] italic">Family run since 1978</p>
                <p className="mt-2 font-display text-[28px] leading-[1.05] sm:text-[34px]">
                  Forty-six years of the same lasagna on Mill Lane
                </p>
                <p className="mt-3 max-w-[30ch] text-[12px] leading-relaxed text-[#5e4f43]">
                  Twelve layers, slow-baked every morning — the dish 212 neighbours keep writing about.
                </p>
                <span className="mt-5 inline-flex h-8 items-center rounded-[2px] bg-[#8f4127] px-4 text-[11px] text-[#fbf7f1]">
                  Reserve a table
                </span>
              </div>
              <div className="relative mx-auto grid aspect-square w-full max-w-[150px] place-items-center rounded-full border border-[#2b211a]/50">
                <div className="grid size-[64%] place-items-center rounded-full bg-[#8f4127] font-display text-3xl text-[#fbf7f1] italic">
                  RT
                </div>
              </div>
            </div>
            <div className="hidden grid-cols-3 gap-3 border-t border-[#ddcfbc] sm:grid bg-[#efe6d8] px-6 py-4 text-[10px] text-[#5e4f43]">
              <span>“Still the best lasagna in town.”</span>
              <span>“Tastes like someone&rsquo;s grandmother made it.”</span>
              <span>“Hosted Dad&rsquo;s 70th here.”</span>
            </div>
          </div>
        </div>
      </figure>
    </div>
  );
}
