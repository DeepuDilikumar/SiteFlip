import type { Business } from "@/lib/types";
import { resolveNiche } from "@/lib/niches";
import { PlacesError, type PlacesProvider, type PlacesQuery } from "./types";

/** Hosts that usually mean "has a page, but not a real website". */
const WEAK_HOSTS = ["facebook.com", "instagram.com", "wixsite.com", "weebly.com", "godaddysites.com", "blogspot.com", "linktr.ee", "yelp.com"];

interface PlaceResult {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  primaryTypeDisplayName?: { text: string };
  regularOpeningHours?: { weekdayDescriptions?: string[] };
  reviews?: { rating?: number; text?: { text: string }; authorAttribution?: { displayName?: string } }[];
}

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.nationalPhoneNumber",
  "places.rating",
  "places.userRatingCount",
  "places.websiteUri",
  "places.primaryTypeDisplayName",
  "places.regularOpeningHours",
  "places.reviews",
].join(",");

/**
 * Google Places API (New) — Text Search. Enabled by setting
 * GOOGLE_PLACES_API_KEY; see `./index.ts`.
 */
export class GooglePlacesProvider implements PlacesProvider {
  readonly name = "google";

  constructor(private readonly apiKey: string) {}

  async search({ niche, city }: PlacesQuery): Promise<Business[]> {
    const profile = resolveNiche(niche);
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": this.apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({ textQuery: `${niche} in ${city}`, pageSize: 20 }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new PlacesError(`Places search failed (${response.status}).`);
    }

    const { places = [] } = (await response.json()) as { places?: PlaceResult[] };

    return places.flatMap((place): Business[] => {
      const websiteStatus = classifyWebsite(place.websiteUri);
      if (!websiteStatus || !place.displayName) return [];
      return [
        {
          id: `gp_${place.id}`,
          name: place.displayName.text,
          category: place.primaryTypeDisplayName?.text ?? profile.category,
          niche: profile.key,
          address: place.formattedAddress ?? city,
          city,
          phone: place.nationalPhoneNumber ?? "",
          rating: place.rating ?? 0,
          reviewCount: place.userRatingCount ?? 0,
          websiteStatus,
          websiteUrl: place.websiteUri,
          hours: place.regularOpeningHours?.weekdayDescriptions?.join(" · "),
          reviews: (place.reviews ?? []).slice(0, 5).flatMap((r) =>
            r.text?.text
              ? [{ author: r.authorAttribution?.displayName ?? "Customer", rating: r.rating ?? 5, text: r.text.text }]
              : [],
          ),
        },
      ];
    });
  }
}

function classifyWebsite(uri: string | undefined): Business["websiteStatus"] | null {
  if (!uri) return "none";
  const host = safeHost(uri);
  return host && WEAK_HOSTS.some((weak) => host.endsWith(weak)) ? "weak" : null;
}

function safeHost(uri: string): string | null {
  try {
    return new URL(uri).hostname;
  } catch {
    return null;
  }
}
