-- Migration 0007 — Row Level Security Policies
--
-- Modelo de acesso:
--   Workers (backend) → SERVICE_ROLE_KEY → bypassa RLS
--   Painel admin      → anon key + JWT    → passa por RLS
--
-- Roles: viewer (só SELECT), curator (SELECT + curadoria), super_admin (tudo)

-- ── ADMIN_USERS ────────────────────────────────────────────────────────────
CREATE POLICY "admin_users_self_select" ON admin_users
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR is_super_admin());

CREATE POLICY "admin_users_super_admin_all" ON admin_users
  FOR ALL TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- ── STORE_CONFIGS ──────────────────────────────────────────────────────────
CREATE POLICY "store_configs_read_admin" ON store_configs
  FOR SELECT TO authenticated
  USING (is_authenticated_admin());

CREATE POLICY "store_configs_write_super" ON store_configs
  FOR ALL TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- ── DISCOVERY_QUERIES ──────────────────────────────────────────────────────
CREATE POLICY "discovery_queries_read" ON discovery_queries
  FOR SELECT TO authenticated USING (is_authenticated_admin());

CREATE POLICY "discovery_queries_write_curator" ON discovery_queries
  FOR ALL TO authenticated
  USING (is_curator_or_above())
  WITH CHECK (is_curator_or_above());

-- ── PRODUCTS ───────────────────────────────────────────────────────────────
CREATE POLICY "products_read_admin" ON products
  FOR SELECT TO authenticated USING (is_authenticated_admin());
-- Workers escrevem via service role (bypassa RLS)

-- ── OFFERS ─────────────────────────────────────────────────────────────────
CREATE POLICY "offers_read_admin" ON offers
  FOR SELECT TO authenticated USING (is_authenticated_admin());

CREATE POLICY "offers_update_curator" ON offers
  FOR UPDATE TO authenticated
  USING (is_curator_or_above())
  WITH CHECK (is_curator_or_above());

-- ── PRICE_HISTORY ──────────────────────────────────────────────────────────
CREATE POLICY "price_history_read" ON price_history
  FOR SELECT TO authenticated USING (is_authenticated_admin());

-- ── COUPONS ────────────────────────────────────────────────────────────────
CREATE POLICY "coupons_read" ON coupons
  FOR SELECT TO authenticated USING (is_authenticated_admin());

CREATE POLICY "coupons_manual_write_curator" ON coupons
  FOR INSERT TO authenticated
  WITH CHECK (is_curator_or_above() AND source = 'manual');

CREATE POLICY "coupons_update_curator" ON coupons
  FOR UPDATE TO authenticated
  USING (is_curator_or_above());

-- ── CHANNELS ───────────────────────────────────────────────────────────────
CREATE POLICY "channels_read" ON channels
  FOR SELECT TO authenticated USING (is_authenticated_admin());

CREATE POLICY "channels_write_super" ON channels
  FOR ALL TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- ── POSTS ──────────────────────────────────────────────────────────────────
CREATE POLICY "posts_read" ON posts
  FOR SELECT TO authenticated USING (is_authenticated_admin());

CREATE POLICY "posts_soft_delete" ON posts
  FOR UPDATE TO authenticated
  USING (is_curator_or_above())
  WITH CHECK (is_curator_or_above());

-- ── JOB_QUEUE ──────────────────────────────────────────────────────────────
CREATE POLICY "job_queue_read" ON job_queue
  FOR SELECT TO authenticated USING (is_authenticated_admin());

CREATE POLICY "job_queue_requeue" ON job_queue
  FOR UPDATE TO authenticated
  USING (is_curator_or_above())
  WITH CHECK (is_curator_or_above());

-- ── API_QUOTA_LOG ──────────────────────────────────────────────────────────
CREATE POLICY "api_quota_read" ON api_quota_log
  FOR SELECT TO authenticated USING (is_authenticated_admin());

-- ── CURATION_BLACKLIST ─────────────────────────────────────────────────────
CREATE POLICY "blacklist_read" ON curation_blacklist
  FOR SELECT TO authenticated USING (is_authenticated_admin());

CREATE POLICY "blacklist_write_curator" ON curation_blacklist
  FOR ALL TO authenticated
  USING (is_curator_or_above())
  WITH CHECK (is_curator_or_above());

-- ── BANNED_USERS ───────────────────────────────────────────────────────────
CREATE POLICY "banned_users_read" ON banned_users
  FOR SELECT TO authenticated USING (is_authenticated_admin());

CREATE POLICY "banned_users_write_curator" ON banned_users
  FOR ALL TO authenticated
  USING (is_curator_or_above())
  WITH CHECK (is_curator_or_above());

-- ── PUBLISHER_CONFIG ───────────────────────────────────────────────────────
CREATE POLICY "publisher_config_read" ON publisher_config
  FOR SELECT TO authenticated USING (is_authenticated_admin());

CREATE POLICY "publisher_config_write_super" ON publisher_config
  FOR UPDATE TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());
