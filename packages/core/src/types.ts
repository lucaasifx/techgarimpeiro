import { z } from 'zod';

// ─── Prices (always integer cents) ─────────────────────────────────────────

export const PriceCents = z.number().int().nonnegative();
export type PriceCents = z.infer<typeof PriceCents>;

// ─── Normalized Product ─────────────────────────────────────────────────────
// Common shape produced by every store adapter before writing to Supabase.

export const NormalizedProductSchema = z.object({
  storeSlug: z.string(),
  externalId: z.string(),
  url: z.string().url(),
  title: z.string(),
  description: z.string().optional(),
  imageUrls: z.array(z.string().url()),
  videoUrl: z.string().url().optional(),
  categoryPath: z.array(z.string()),
  brand: z.string().optional(),
  ratingAvg: z.number().min(0).max(5).optional(),
  ratingCount: z.number().int().nonnegative().optional(),
  ordersCount: z.number().int().nonnegative().optional(),
  sellerName: z.string().optional(),
  sellerRating: z.number().min(0).max(5).optional(),
  sellerCountry: z.string().optional(),
  shipping: z.record(z.unknown()).optional(),
  promotions: z.record(z.unknown()).optional(),
  raw: z.record(z.unknown()).optional(),
});

export type NormalizedProduct = z.infer<typeof NormalizedProductSchema>;

// ─── Normalized Offer ───────────────────────────────────────────────────────

export const NormalizedOfferSchema = z.object({
  storeSlug: z.string(),
  externalProductId: z.string(),
  originalPriceCents: PriceCents.optional(),
  priceCents: PriceCents,
  discountPercent: z.number().min(0).max(100).optional(),
  affiliateUrl: z.string().url().optional(),
});

export type NormalizedOffer = z.infer<typeof NormalizedOfferSchema>;

// ─── Discovery Query ────────────────────────────────────────────────────────

export const DiscoveryQueryParamsSchema = z.object({
  keywords: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  minOrders: z.number().int().optional(),
  sort: z.enum(['volume_desc', 'discount_desc', 'price_asc', 'price_desc']).optional(),
  limit: z.number().int().min(1).max(100).default(50),
  minDiscount: z.number().min(0).max(100).optional(),
});

export type DiscoveryQueryParams = z.infer<typeof DiscoveryQueryParamsSchema>;

// ─── Job kinds ──────────────────────────────────────────────────────────────

export type JobKind = 'enrich' | 'curate' | 'publish_product' | 'track_price';

export interface JobPayload {
  enrich: { offerId: string };
  curate: { offerId: string };
  publish_product: { offerId: string; channelId: string };
  track_price: { productId: string };
}
