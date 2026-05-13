import { createHash } from 'crypto';
import got from 'got';

const BASE_URL = 'https://api-sg.aliexpress.com/sync';

type Params = Record<string, string | number | undefined>;

function sign(appSecret: string, params: Record<string, string>): string {
  const sorted = Object.keys(params).sort();
  const str = appSecret + sorted.map(k => k + params[k]).join('') + appSecret;
  return createHash('md5').update(str, 'utf8').digest('hex').toUpperCase();
}

function buildForm(
  appKey: string,
  appSecret: string,
  method: string,
  bizParams: Params,
): Record<string, string> {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

  const base: Record<string, string> = {
    app_key: appKey,
    method,
    timestamp,
    sign_method: 'md5',
    v: '2.0',
  };

  for (const [k, v] of Object.entries(bizParams)) {
    if (v !== undefined) base[k] = String(v);
  }

  base['sign'] = sign(appSecret, base);
  return base;
}

async function call<T>(form: Record<string, string>): Promise<T> {
  return got.post(BASE_URL, { form }).json<T>();
}

export interface AliProductRaw {
  product_id: string;
  product_title: string;
  product_main_image_url: string;
  product_small_image_urls?: { string?: string[] };
  product_detail_url: string;
  promotion_link?: string;
  sale_price?: string;
  target_sale_price?: string;
  target_sale_price_currency?: string;
  original_price?: string;
  target_original_price?: string;
  discount?: string;
  evaluate_rate?: string;
  lastest_volume?: number;
  shop_id?: string;
  shop_url?: string;
  first_level_category_id?: number;
  first_level_category_name?: string;
  second_level_category_id?: number;
  second_level_category_name?: string;
  commission_rate?: string;
}

interface ProductQueryResponse {
  aliexpress_affiliate_product_query_response?: {
    resp_result?: {
      resp_code: number;
      resp_msg: string;
      result?: {
        current_page_no: number;
        total_record_count: number;
        products?: { product?: AliProductRaw[] };
      };
    };
  };
}

interface LinkGenerateResponse {
  aliexpress_affiliate_link_generate_response?: {
    resp_result?: {
      resp_code: number;
      resp_msg: string;
      result?: {
        promotion_links?: {
          promotion_link?: { promotion_link: string; source_value: string }[];
        };
      };
    };
  };
}

export class AliExpressApiClient {
  constructor(
    private readonly appKey: string,
    private readonly appSecret: string,
    private readonly trackingId: string,
  ) {}

  async productQuery(params: {
    keywords?: string;
    categoryIds?: string;
    sort?: string;
    pageNo?: number;
    pageSize?: number;
  }): Promise<AliProductRaw[]> {
    const form = buildForm(this.appKey, this.appSecret, 'aliexpress.affiliate.product.query', {
      fields: [
        'commission_rate', 'sale_price', 'original_price', 'product_id', 'product_title',
        'product_main_image_url', 'product_small_image_urls', 'product_detail_url',
        'evaluate_rate', 'lastest_volume', 'shop_url', 'shop_id',
        'first_level_category_id', 'first_level_category_name',
        'second_level_category_id', 'second_level_category_name',
        'target_sale_price', 'target_original_price', 'discount', 'promotion_link',
      ].join(','),
      keywords: params.keywords,
      category_ids: params.categoryIds,
      sort: params.sort ?? 'LAST_VOLUME_DESC',
      target_currency: 'BRL',
      target_language: 'PT',
      ship_to_country: 'BR',
      page_no: params.pageNo ?? 1,
      page_size: Math.min(params.pageSize ?? 50, 50),
      tracking_id: this.trackingId,
    });

    const res = await call<ProductQueryResponse>(form);
    const result = res.aliexpress_affiliate_product_query_response?.resp_result;

    if (!result || result.resp_code !== 200) {
      throw new Error(`productQuery failed: ${result?.resp_msg ?? 'unknown error'}`);
    }

    return result.result?.products?.product ?? [];
  }

  async linkGenerate(productUrl: string): Promise<string | null> {
    const form = buildForm(this.appKey, this.appSecret, 'aliexpress.affiliate.link.generate', {
      promotion_link_type: '0',
      source_values: productUrl,
      tracking_id: this.trackingId,
    });

    const res = await call<LinkGenerateResponse>(form);
    const result = res.aliexpress_affiliate_link_generate_response?.resp_result;

    if (!result || result.resp_code !== 200) return null;

    const links = result.result?.promotion_links?.promotion_link;
    return links?.[0]?.promotion_link ?? null;
  }
}
