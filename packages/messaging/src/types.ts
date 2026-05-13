export type PostKind = 'product' | 'coupon_summary' | 'event' | 'lowest_price';

export interface RenderedPost {
  caption: string;       // HTML (Telegram parse_mode: 'HTML')
  photoUrl?: string;
  affiliateUrl?: string;
}
