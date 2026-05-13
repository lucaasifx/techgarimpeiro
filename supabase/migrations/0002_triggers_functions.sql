-- Migration 0002 — Triggers e Funções

-- ── updated_at automático ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

CREATE TRIGGER set_updated_at_offers
  BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_products
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_coupons
  BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_store_configs
  BEFORE UPDATE ON store_configs
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ── JOB QUEUE: claim ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION claim_jobs(
  p_kind   text,
  p_limit  int,
  p_worker text
)
RETURNS SETOF job_queue
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  UPDATE job_queue
  SET status    = 'processing',
      locked_at = now(),
      locked_by = p_worker,
      attempts  = attempts + 1
  WHERE id IN (
    SELECT id FROM job_queue
    WHERE status      = 'pending'
      AND kind        = p_kind
      AND scheduled_for <= now()
    ORDER BY priority DESC, scheduled_for ASC
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
END $$;

-- ── JOB QUEUE: complete ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION complete_job(
  p_job_id bigint,
  p_result jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE sql AS $$
  UPDATE job_queue
  SET status       = 'completed',
      completed_at = now(),
      result       = p_result
  WHERE id = p_job_id;
$$;

-- ── JOB QUEUE: fail (com backoff exponencial) ─────────────────────────────
CREATE OR REPLACE FUNCTION fail_job(
  p_job_id bigint,
  p_error  text
)
RETURNS void
LANGUAGE plpgsql AS $$
DECLARE
  v_attempts int;
  v_max      int;
BEGIN
  SELECT attempts, max_attempts INTO v_attempts, v_max
  FROM job_queue WHERE id = p_job_id;

  IF v_attempts < v_max THEN
    -- backoff: 1 min, 4 min, 16 min …
    UPDATE job_queue
    SET status        = 'pending',
        scheduled_for = now() + (power(4, v_attempts) || ' minutes')::interval,
        last_error    = p_error,
        locked_at     = NULL,
        locked_by     = NULL
    WHERE id = p_job_id;
  ELSE
    UPDATE job_queue
    SET status     = 'failed',
        failed_at  = now(),
        last_error = p_error
    WHERE id = p_job_id;
  END IF;
END $$;

-- ── Trigger: quando offer é aprovada, enfileira publish_product ───────────
CREATE OR REPLACE FUNCTION offers_after_approve()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_channel_id uuid;
BEGIN
  IF NEW.status = 'approved' AND OLD.status <> 'approved' THEN
    SELECT id INTO v_channel_id FROM channels WHERE active = true LIMIT 1;
    IF v_channel_id IS NOT NULL THEN
      INSERT INTO job_queue (kind, payload, priority)
      VALUES (
        'publish_product',
        jsonb_build_object('offerId', NEW.id, 'channelId', v_channel_id),
        7
      );
    END IF;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER offers_after_approve_trigger
  AFTER UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION offers_after_approve();
