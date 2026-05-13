import express from 'express';
import { getEnv, logger } from '@techgarimpeiro/shared';
import { getDbClient, enqueueJob } from '@techgarimpeiro/db';
import { AliExpressAdapter, registerAdapter, getAdapter } from '@techgarimpeiro/store-adapters';
import { DiscoveryQueryParamsSchema } from '@techgarimpeiro/core';

// Register adapters on boot
registerAdapter(new AliExpressAdapter({
  appKey: process.env['ALIEXPRESS_APP_KEY'] ?? '',
  appSecret: process.env['ALIEXPRESS_APP_SECRET'] ?? '',
  trackingId: process.env['ALIEXPRESS_TRACKING_ID'] ?? 'techgarimpeiro',
}));

async function runDiscovery(): Promise<void> {
  const db = getDbClient();

  const { data: queries, error } = await db
    .from('discovery_queries')
    .select('*')
    .eq('active', true)
    .or('cooldown_until.is.null,cooldown_until.lt.' + new Date().toISOString())
    .order('priority', { ascending: false });

  if (error) throw new Error(`Failed to fetch discovery_queries: ${error.message}`);

  logger.info({ count: queries?.length ?? 0 }, 'discovery queries loaded');

  for (const query of queries ?? []) {
    const parseResult = DiscoveryQueryParamsSchema.safeParse(query.params);
    if (!parseResult.success) {
      logger.warn({ queryId: query.id, errors: parseResult.error.flatten() }, 'invalid query params, skipping');
      continue;
    }

    const params = parseResult.data;
    const adapter = getAdapter(query.store_slug);

    logger.info({ label: query.label }, 'running discovery query');

    try {
      const results = await adapter.discover(params);
      logger.info({ label: query.label, count: results.length }, 'products discovered');

      let newOffers = 0;

      for (const { product, offer } of results) {
        // Upsert product
        const { data: dbProduct, error: productError } = await db
          .from('products')
          .upsert({
            store_slug: product.storeSlug,
            external_id: product.externalId,
            url: product.url,
            title: product.title,
            image_urls: product.imageUrls,
            category_path: product.categoryPath,
            rating_avg: product.ratingAvg ?? null,
            orders_count: product.ordersCount ?? null,
            seller_name: product.sellerName ?? null,
            shipping: (product.shipping ?? null) as never,
            raw: (product.raw ?? null) as never,
            last_seen_at: new Date().toISOString(),
          }, { onConflict: 'store_slug,external_id' })
          .select('id')
          .single();

        if (productError || !dbProduct) {
          logger.warn({ externalId: product.externalId, error: productError?.message }, 'product upsert failed');
          continue;
        }

        // Skip if a recent offer exists (< 1h) to avoid duplicates
        const { count } = await db
          .from('offers')
          .select('*', { count: 'exact', head: true })
          .eq('product_id', dbProduct.id)
          .gte('created_at', new Date(Date.now() - 3_600_000).toISOString());

        if (count && count > 0) continue;

        // Insert offer
        const { data: dbOffer, error: offerError } = await db
          .from('offers')
          .insert({
            product_id: dbProduct.id,
            store_slug: offer.storeSlug,
            price_cents: offer.priceCents,
            original_price_cents: offer.originalPriceCents ?? null,
            discount_percent: offer.discountPercent ?? null,
            affiliate_url: offer.affiliateUrl ?? null,
            status: 'discovered',
          })
          .select('id')
          .single();

        if (offerError || !dbOffer) {
          logger.warn({ error: offerError?.message }, 'offer insert failed');
          continue;
        }

        await enqueueJob('enrich', { offerId: dbOffer.id });
        newOffers++;
      }

      logger.info({ label: query.label, newOffers }, 'query complete');

      await db
        .from('discovery_queries')
        .update({ last_run_at: new Date().toISOString(), last_error: null })
        .eq('id', query.id);

    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error({ label: query.label, error: message }, 'discovery query failed');

      await db
        .from('discovery_queries')
        .update({ last_error: message })
        .eq('id', query.id);
    }
  }
}

// ── HTTP server ───────────────────────────────────────────────────────────────

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'worker-discovery' });
});

app.post('/cron/discovery', (req, res) => {
  const env = getEnv();
  if (req.headers['x-cron-secret'] !== env.CRON_SECRET) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Respond immediately and run async
  res.json({ accepted: true });
  runDiscovery().catch(err => logger.error({ err }, 'runDiscovery crashed'));
});

const env = getEnv();
app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, 'worker-discovery started');
});
