-- Migration 0005 — Habilita Row Level Security em todas as tabelas

ALTER TABLE store_configs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_queries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE products              ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers                ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history         ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons               ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels              ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_queue             ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_quota_log         ENABLE ROW LEVEL SECURITY;
ALTER TABLE curation_blacklist    ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE publisher_config      ENABLE ROW LEVEL SECURITY;
