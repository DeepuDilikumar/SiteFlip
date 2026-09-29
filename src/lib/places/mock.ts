import type { Business, Review } from "@/lib/types";
import { resolveNiche } from "@/lib/niches";
import { hashString, pick, seededRandom, shuffle, slug } from "@/lib/random";
import type { PlacesProvider, PlacesQuery } from "./types";

const FIRST_NAMES = ["Maria", "James", "Priya", "Tom", "Lena", "Marcus", "Aisha", "Daniel", "Grace", "Omar", "Sofia", "Ben"];
const LAST_INITIALS = ["R.", "K.", "M.", "T.", "S.", "L.", "P.", "D.", "W.", "H."];
const OWNER_NAMES = ["Joe", "Anna", "Mike", "Rosa", "Sam", "Nina", "Vic", "Carla", "Frank", "Dev"];
const STREETS = ["Main St", "Oak Ave", "Elm St", "Market St", "Park Rd", "Church St", "Mill Ln", "Station Rd", "High St", "Maple Ave"];
const WEAK_SITE_HOSTS = ["wixsite.com", "weebly.com", "godaddysites.com", "blogspot.com"];

/**
 * Deterministic, realistic mock data: the same niche + city always returns the
 * same businesses, so the full flow is demoable without a Places API key.
 */
export class MockPlacesProvider implements PlacesProvider {
  readonly name = "mock";

  async search({ niche, city }: PlacesQuery): Promise<Business[]> {
    const profile = resolveNiche(niche);
    const cityName = city.trim().replace(/\b\w/g, (c) => c.toUpperCase());
    const rand = seededRandom(`${profile.key}|${cityName.toLowerCase()}`);
    const stems = shuffle(rand, profile.nameStems);
    // One business per name stem keeps names unique within a search.
    const count = Math.min(7 + Math.floor(rand() * 5), stems.length);
    const phonePrefix = 200 + (hashString(cityName) % 700);

    return Array.from({ length: count }, (_, i) => {
      const name = `${stems[i]} ${pick(rand, profile.nameSuffixes)}`;
      const owner = pick(rand, OWNER_NAMES);
      const reviewCount = 12 + Math.floor(rand() * 260);
      const rating = Math.round((4 + rand() * 0.9) * 10) / 10;
      const weak = rand() < 0.3;
      const reviews: Review[] = shuffle(rand, profile.reviewTemplates)
        .slice(0, 3)
        .map((template) => ({
          author: `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_INITIALS)}`,
          rating: rand() < 0.8 ? 5 : 4,
          text: template.replace("{first}", owner),
        }));

      return {
        id: `mock_${slug(`${name}-${cityName}`)}_${hashString(`${name}|${cityName}|${i}`).toString(36)}`,
        name,
        category: profile.category,
        niche: profile.key,
        address: `${10 + Math.floor(rand() * 980)} ${pick(rand, STREETS)}, ${cityName}`,
        city: cityName,
        phone: `(${phonePrefix}) ${100 + Math.floor(rand() * 899)}-${String(Math.floor(rand() * 10000)).padStart(4, "0")}`,
        rating,
        reviewCount,
        websiteStatus: weak ? "weak" : "none",
        websiteUrl: weak ? `${slug(name)}.${pick(rand, WEAK_SITE_HOSTS)}` : undefined,
        yearEstablished: rand() < 0.7 ? 1952 + Math.floor(rand() * 68) : undefined,
        hours: profile.hours,
        reviews,
      } satisfies Business;
    }).sort((a, b) => b.reviewCount - a.reviewCount);
  }
}
