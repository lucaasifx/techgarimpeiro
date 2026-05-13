import type { DiscoveryQueryParams, NormalizedOffer, NormalizedProduct } from './types.js';

// Contract every store adapter must implement.
// Sprint 1 adds the AliExpress implementation in packages/store-adapters.

export interface DiscoveryResult {
  product: NormalizedProduct;
  offer: NormalizedOffer;
}

export interface StoreAdapter {
  readonly storeSlug: string;

  /** Discover products matching the query and return normalized results. */
  discover(params: DiscoveryQueryParams): Promise<DiscoveryResult[]>;

  /** Generate an affiliate link for a product URL. */
  buildAffiliateUrl(productUrl: string): Promise<string>;
}
