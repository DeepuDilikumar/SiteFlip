import type { Business } from "@/lib/types";

export interface PlacesQuery {
  niche: string;
  city: string;
}

/**
 * Anything that can find local businesses. Implementations must only return
 * businesses with no website or a weak one — that's the whole point of a search.
 */
export interface PlacesProvider {
  readonly name: string;
  search(query: PlacesQuery): Promise<Business[]>;
}

export class PlacesError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "PlacesError";
  }
}
