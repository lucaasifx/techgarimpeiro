export interface CurationInput {
  discountPercent: number;
  isNicheTech: boolean;
  sellerRating: number;
  isLowest30d: boolean;
  isLowest90d: boolean;
  hasCoupon: boolean;
  daysSinceLastSeen: number;
}

export interface CurationBreakdown {
  discount: number;
  niche: number;
  seller: number;
  history: number;
  freshness: number;
  combo: number;
}

export interface CurationResult {
  score: number;        // 0–100
  breakdown: CurationBreakdown;
  status: 'approved' | 'pending_review' | 'rejected';
}
