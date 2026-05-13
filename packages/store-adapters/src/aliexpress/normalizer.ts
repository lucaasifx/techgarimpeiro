import type { NormalizedProduct, NormalizedOffer } from '@techgarimpeiro/core';
import type { AliProductRaw } from './api-client.js';

function priceToCents(price: string | undefined): number {
  if (!price) return 0;
  return Math.round(parseFloat(price.replace(',', '.')) * 100);
}

function ratingFromPercent(rate: string | undefined): number | undefined {
  if (!rate) return undefined;
  const pct = parseFloat(rate.replace('%', ''));
  return isNaN(pct) ? undefined : Math.round((pct / 100) * 5 * 100) / 100;
}

function discountFromStr(discount: string | undefined): number | undefined {
  if (!discount) return undefined;
  const n = parseFloat(discount.replace('%', ''));
  return isNaN(n) ? undefined : n;
}

export interface NormalizedResult {
  product: NormalizedProduct;
  offer: NormalizedOffer;
}

export function normalizeProduct(raw: AliProductRaw): NormalizedResult {
  const imageUrls: string[] = [];
  if (raw.product_main_image_url) imageUrls.push(raw.product_main_image_url);
  const smallImages = raw.product_small_image_urls?.string ?? [];
  for (const img of smallImages) {
    if (img && !imageUrls.includes(img)) imageUrls.push(img);
  }

  const categoryPath: string[] = [];
  if (raw.first_level_category_name) categoryPath.push(raw.first_level_category_name);
  if (raw.second_level_category_name) categoryPath.push(raw.second_level_category_name);

  const priceCents = priceToCents(raw.target_sale_price ?? raw.sale_price);
  const originalPriceCents = priceToCents(raw.target_original_price ?? raw.original_price);

  const product: NormalizedProduct = {
    storeSlug: 'aliexpress',
    externalId: String(raw.product_id),
    url: raw.product_detail_url,
    title: raw.product_title,
    imageUrls,
    categoryPath,
    ordersCount: raw.lastest_volume,
    sellerName: raw.shop_id ? `Shop ${raw.shop_id}` : undefined,
    ratingAvg: ratingFromPercent(raw.evaluate_rate),
    shipping: { isFree: true },
    raw: raw as unknown as Record<string, unknown>,
  };

  const offer: NormalizedOffer = {
    storeSlug: 'aliexpress',
    externalProductId: String(raw.product_id),
    priceCents,
    originalPriceCents: originalPriceCents > 0 ? originalPriceCents : undefined,
    discountPercent: discountFromStr(raw.discount),
    affiliateUrl: raw.promotion_link ?? undefined,
  };

  return { product, offer };
}
