import type { DiscoveryQueryParams, StoreAdapter } from '@techgarimpeiro/core';
import type { DiscoveryResult } from '@techgarimpeiro/core';
import { AliExpressApiClient } from './api-client.js';
import { normalizeProduct } from './normalizer.js';

const SORT_MAP: Record<string, string> = {
  volume_desc: 'LAST_VOLUME_DESC',
  discount_desc: 'DISCOUNT_DESC',
  price_asc: 'SALE_PRICE_ASC',
  price_desc: 'SALE_PRICE_DESC',
};

export class AliExpressAdapter implements StoreAdapter {
  readonly storeSlug = 'aliexpress';

  private readonly client: AliExpressApiClient;

  constructor(opts: { appKey: string; appSecret: string; trackingId: string }) {
    this.client = new AliExpressApiClient(opts.appKey, opts.appSecret, opts.trackingId);
  }

  async discover(params: DiscoveryQueryParams): Promise<DiscoveryResult[]> {
    const queryParams: Parameters<AliExpressApiClient['productQuery']>[0] = {
      pageSize: Math.min(params.limit, 50),
    };
    if (params.keywords?.length) queryParams.keywords = params.keywords.join(' ');
    if (params.categoryIds?.length) queryParams.categoryIds = params.categoryIds.join(',');
    const mappedSort = params.sort ? SORT_MAP[params.sort] : undefined;
    if (mappedSort) queryParams.sort = mappedSort;

    const raw = await this.client.productQuery(queryParams);

    const results: DiscoveryResult[] = [];

    for (const item of raw) {
      // Quality filters
      if (item.lastest_volume !== undefined && params.minOrders !== undefined) {
        if (item.lastest_volume < params.minOrders) continue;
      }

      const { product, offer } = normalizeProduct(item);

      if (offer.priceCents < 100) continue; // skip items below R$ 1

      results.push({ product, offer });
    }

    return results;
  }

  async buildAffiliateUrl(productUrl: string): Promise<string> {
    const link = await this.client.linkGenerate(productUrl);
    return link ?? productUrl;
  }
}
