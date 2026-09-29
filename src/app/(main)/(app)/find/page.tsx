import type { Metadata } from "next";
import Link from "next/link";
import { SearchForm } from "@/components/app/search-form";
import { POPULAR_NICHES } from "@/lib/niches";

export const metadata: Metadata = { title: "Find businesses" };

export default function FindPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 pt-[14vh] pb-16 sm:px-6">
      <h1 className="text-center font-display text-5xl tracking-tight sm:text-6xl">Who needs a website?</h1>
      <p className="mt-3 text-center text-[15px] text-ink-2">
        Search a niche and a city. We only show businesses with no website, or a weak one.
      </p>
      <div className="mt-10 w-full">
        <SearchForm />
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Popular searches">
        {POPULAR_NICHES.map((niche) => (
          <Link
            key={niche}
            href={`/find/results?niche=${encodeURIComponent(niche)}&city=Austin`}
            className="rounded-full px-3 py-1.5 text-[13px] text-ink-3 transition-colors hover:bg-surface hover:text-ink hover:shadow-card"
          >
            {niche} in Austin
          </Link>
        ))}
      </div>
    </div>
  );
}
