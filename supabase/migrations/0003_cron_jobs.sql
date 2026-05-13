-- Migration 0003 — Cron Jobs (pg_cron)
-- Requer: extensão pg_cron habilitada e variáveis de configuração definidas.
--
-- Antes de aplicar, defina no Supabase Dashboard → Database → Configuration:
--   app.workers_url  = https://<seu-workers-url>
--   app.cron_secret  = <mesmo valor de CRON_SECRET no .env>

-- Discovery a cada 30 min
SELECT cron.schedule(
  'discovery-tick',
  '*/30 * * * *',
  $$ SELECT net.http_post(
       url     := current_setting('app.workers_url') || '/cron/discovery',
       headers := jsonb_build_object('x-cron-secret', current_setting('app.cron_secret'))
     ) $$
);

-- Publisher a cada 5 min
SELECT cron.schedule(
  'publisher-tick',
  '*/5 * * * *',
  $$ SELECT net.http_post(
       url     := current_setting('app.workers_url') || '/cron/publisher',
       headers := jsonb_build_object('x-cron-secret', current_setting('app.cron_secret'))
     ) $$
);

-- Price tracker diário (3h BRT = 6h UTC)
SELECT cron.schedule(
  'price-tracker-daily',
  '0 6 * * *',
  $$ SELECT net.http_post(
       url     := current_setting('app.workers_url') || '/cron/price-tracker',
       headers := jsonb_build_object('x-cron-secret', current_setting('app.cron_secret'))
     ) $$
);

-- Expirar offers antigas (domingo 4h UTC)
SELECT cron.schedule(
  'expire-old-offers',
  '0 4 * * 0',
  $$ UPDATE offers
     SET status = 'expired'
     WHERE status IN ('discovered','enriched','pending_review')
       AND created_at < now() - interval '7 days' $$
);

-- Limpeza de price_history > 365 dias (1º de cada mês 5h UTC)
SELECT cron.schedule(
  'price-history-retention',
  '0 5 1 * *',
  $$ DELETE FROM price_history
     WHERE observed_at < now() - interval '365 days' $$
);
