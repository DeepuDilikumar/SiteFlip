import "server-only";
import { businesses } from "@/lib/db";
import type { Business } from "@/lib/types";
import { GooglePlacesProvider } from "./google";
import { MockPlacesProvider } from "./mock";
import type { PlacesProvider, PlacesQuery } from "./types";

export { PlacesError } from "./types";

/** Uses Google Places when a key is configured; otherwise realistic mock data. */
export function placesProvider(): PlacesProvider {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  return key ? new GooglePlacesProvider(key) : new MockPlacesProvider();
}

/** Searches and caches results so later pages can look businesses up by id. */
export async function findBusinesses(query: PlacesQuery): Promise<Business[]> {
  const results = await placesProvider().search(query);
  await businesses.upsertMany(results);
  return results;
}
