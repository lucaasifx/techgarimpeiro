-- Migration 0001 — Extensões e Tabelas Base
-- Aplicar no Supabase: Database → SQL Editor (ou supabase db push)

-- ── Extensões ────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_cron";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "http";    -- net.http_post para pg_cron → workers

-- ── STORE CONFIGS ─────────────────────────────────────────────────────────────
CREATE TABLE store_configs (
  slug                text PRIMARY KEY,                  -- 'aliexpress', 'amazon-br'
  display_name        text NOT NULL,
  active              boolean NOT NULL DEFAULT true,
  api_credentials     jsonb,                             -- segredos via Vault, não aqui
  curation_weights    jsonb NOT NULL DEFAULT '{
    "discount": 30, "niche": 25, "seller": 15,
    "history": 15, "freshness": 10, "combo": 5
  }'::jsonb,
  thresholds          jsonb NOT NULL DEFAULT '{
    "autoApprove": 75, "review": 40
  }'::jsonb,
  daily_api_budget    int DEFAULT 4500,
  scraper_enabled     boolean DEFAULT true,
  config              jsonb DEFAULT '{}'::jsonb,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ── DISCOVERY QUERIES ─────────────────────────────────────────────────────────
CREATE TABLE discovery_queries (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_slug          text NOT NULL REFERENCES store_configs(slug),
  label               text NOT NULL,
  params              jsonb NOT NULL,
  priority            int NOT NULL DEFAULT 5,            -- 1-10
  active              boolean NOT NULL DEFAULT true,
  cooldown_until      timestamptz,
  last_run_at         timestamptz,
  last_error          text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX discovery_queries_store_active_idx
  ON discovery_queries (store_slug, active, priority DESC);

-- ── PRODUCTS ──────────────────────────────────────────────────────────────────
CREATE TABLE products (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_slug          text NOT NULL REFERENCES store_configs(slug),
  external_id         text NOT NULL,
  url                 text NOT NULL,
  title               text NOT NULL,
  description         text,
  image_urls          text[] NOT NULL DEFAULT '{}',
  cached_image_path   text,
  video_url           text,
  category_path       text[] NOT NULL DEFAULT '{}',
  brand               text,
  rating_avg          numeric(3,2),
  rating_count        int,
  orders_count        int,
  seller_name         text,
  seller_rating       numeric(3,2),
  seller_country      text,
  shipping            jsonb,
  promotions          jsonb,
  raw                 jsonb,
  first_seen_at       timestamptz NOT NULL DEFAULT now(),
  last_seen_at        timestamptz NOT NULL DEFAULT now(),
  deleted_at          timestamptz,
  UNIQUE (store_slug, external_id)
);

CREATE INDEX products_last_seen_idx ON products (last_seen_at DESC);
CREATE INDEX products_category_idx ON products USING gin (category_path);
CREATE INDEX products_title_trgm_idx ON products USING gin (title gin_trgm_ops);

-- ── OFFERS ────────────────────────────────────────────────────────────────────
CREATE TABLE offers (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id            uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  store_slug            text NOT NULL,

  -- Preços (centavos inteiros)
  original_price_cents  int,
  price_cents           int NOT NULL,
  final_price_cents     int,
  coin_discount_cents   int DEFAULT 0,
  discount_percent      numeric(5,2),

  -- Cupons
  applied_coupon_codes  text[] DEFAULT '{}',

  -- Histórico
  is_lowest_30d         boolean,
  is_lowest_90d         boolean,

  -- Curadoria
  curation_score        numeric(5,2),
  curation_breakdown    jsonb,
  status                text NOT NULL DEFAULT 'discovered'
                          CHECK (status IN (
                            'discovered','enriched','pending_review',
                            'approved','rejected','published','expired'
                          )),
  rejection_reason      text,

  -- Aprovação
  approved_by           uuid,
  approved_at           timestamptz,
  custom_caption        text,
  custom_metadata       jsonb,

  -- Afiliado
  affiliate_url         text,

  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  expires_at            timestamptz
);

CREATE INDEX offers_status_score_idx ON offers (status, curation_score DESC);
CREATE INDEX offers_product_created_idx ON offers (product_id, created_at DESC);
CREATE INDEX offers_pending_review_idx ON offers (created_at DESC)
  WHERE status = 'pending_review';
CREATE INDEX offers_approved_idx ON offers (curation_score DESC, created_at DESC)
  WHERE status = 'approved';

-- ── PRICE HISTORY ─────────────────────────────────────────────────────────────
CREATE TABLE price_history (
  id                  bigserial PRIMARY KEY,
  product_id          uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  observed_at         timestamptz NOT NULL DEFAULT now(),
  price_cents         int NOT NULL,
  final_price_cents   int,
  source              text NOT NULL DEFAULT 'discovery'
                        CHECK (source IN ('discovery','tracker','manual')),
  raw_snapshot        jsonb
);

CREATE INDEX price_history_product_observed_idx
  ON price_history (product_id, observed_at DESC);

-- ── COUPONS ───────────────────────────────────────────────────────────────────
CREATE TABLE coupons (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_slug              text NOT NULL REFERENCES store_configs(slug),
  code                    text NOT NULL,
  scope                   text NOT NULL CHECK (scope IN ('platform','store','product')),
  type                    text NOT NULL CHECK (type IN ('fixed','percent','select')),
  discount_value_cents    int,
  discount_percent        numeric(5,2),
  min_order_value_cents   int,
  max_discount_cents      int,
  valid_from              timestamptz,
  valid_until             timestamptz,
  applicable_categories   text[],
  applicable_product_ids  text[],
  store_seller_id         text,
  description             text,
  source                  text DEFAULT 'api',
  active                  boolean NOT NULL DEFAULT true,
  raw                     jsonb,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  UNIQUE (store_slug, code)
);

CREATE INDEX coupons_active_valid_idx ON coupons (store_slug, active, valid_until)
  WHERE active = true;

-- ── CHANNELS ──────────────────────────────────────────────────────────────────
CREATE TABLE channels (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                text UNIQUE NOT NULL,
  platform            text NOT NULL DEFAULT 'telegram',
  telegram_chat_id    text NOT NULL,
  discussion_chat_id  text,
  display_name        text,
  active              boolean NOT NULL DEFAULT true,
  config              jsonb NOT NULL DEFAULT '{}',
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ── POSTS ─────────────────────────────────────────────────────────────────────
CREATE TABLE posts (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id            uuid NOT NULL REFERENCES channels(id),
  offer_id              uuid REFERENCES offers(id),
  product_id            uuid REFERENCES products(id),
  kind                  text NOT NULL DEFAULT 'product'
                          CHECK (kind IN (
                            'product','coupon_summary','event','lowest_price'
                          )),
  telegram_message_id   bigint,
  telegram_thread_id    bigint,
  caption               text NOT NULL,
  photo_url             text,
  affiliate_url         text,
  metadata              jsonb,
  published_at          timestamptz NOT NULL DEFAULT now(),
  views_count           int,
  forwards_count        int,
  metrics_updated_at    timestamptz,
  deleted_at            timestamptz
);

CREATE INDEX posts_published_idx ON posts (published_at DESC);
CREATE INDEX posts_product_published_idx ON posts (product_id, published_at DESC);
CREATE INDEX posts_channel_published_idx ON posts (channel_id, published_at DESC);

-- ── ADMIN USERS ───────────────────────────────────────────────────────────────
CREATE TABLE admin_users (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         text NOT NULL,
  display_name  text,
  role          text NOT NULL DEFAULT 'curator'
                  CHECK (role IN ('super_admin','curator','viewer')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ── JOB QUEUE ─────────────────────────────────────────────────────────────────
CREATE TABLE job_queue (
  id              bigserial PRIMARY KEY,
  kind            text NOT NULL,
  payload         jsonb NOT NULL,
  priority        int NOT NULL DEFAULT 5,
  status          text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','processing','completed','failed')),
  attempts        int NOT NULL DEFAULT 0,
  max_attempts    int NOT NULL DEFAULT 3,
  scheduled_for   timestamptz NOT NULL DEFAULT now(),
  locked_at       timestamptz,
  locked_by       text,
  completed_at    timestamptz,
  failed_at       timestamptz,
  last_error      text,
  result          jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX job_queue_pending_idx
  ON job_queue (kind, scheduled_for, priority DESC)
  WHERE status = 'pending';
CREATE INDEX job_queue_failed_idx ON job_queue (failed_at DESC)
  WHERE status = 'failed';

-- ── API QUOTA LOG ─────────────────────────────────────────────────────────────
CREATE TABLE api_quota_log (
  id          bigserial PRIMARY KEY,
  store_slug  text NOT NULL,
  endpoint    text NOT NULL,
  day         date NOT NULL DEFAULT current_date,
  calls_used  int NOT NULL DEFAULT 0,
  errors      int NOT NULL DEFAULT 0,
  UNIQUE (store_slug, endpoint, day)
);

-- ── BLACKLIST ─────────────────────────────────────────────────────────────────
CREATE TABLE curation_blacklist (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_type  text NOT NULL CHECK (pattern_type IN ('keyword','regex','seller','category')),
  pattern       text NOT NULL,
  reason        text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE banned_users (
  telegram_user_id  bigint PRIMARY KEY,
  reason            text,
  banned_at         timestamptz NOT NULL DEFAULT now(),
  banned_by         uuid REFERENCES admin_users(id)
);

-- ── PUBLISHER CONFIG (singleton) ──────────────────────────────────────────────
CREATE TABLE publisher_config (
  id              int PRIMARY KEY DEFAULT 1,
  posting_hours   jsonb NOT NULL DEFAULT '{
    "start": "08:00", "end": "23:00", "tz": "America/Sao_Paulo"
  }'::jsonb,
  max_posts_per_hour    int NOT NULL DEFAULT 3,
  max_posts_per_day     int NOT NULL DEFAULT 20,
  min_interval_minutes  int NOT NULL DEFAULT 15,
  diversity_window      int NOT NULL DEFAULT 5,
  max_same_category_in_window int NOT NULL DEFAULT 2,
  coupon_post_frequency_hours int NOT NULL DEFAULT 12,
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CHECK (id = 1)
);

INSERT INTO publisher_config (id) VALUES (1) ON CONFLICT DO NOTHING;
