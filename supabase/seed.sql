-- Seed mínimo para desenvolvimento e staging
-- Executar depois de aplicar todas as migrations (0001–0007)

-- ── Loja AliExpress ──────────────────────────────────────────────────────────
INSERT INTO store_configs (slug, display_name, daily_api_budget)
VALUES ('aliexpress', 'AliExpress', 4500)
ON CONFLICT DO NOTHING;

-- ── Canal principal ───────────────────────────────────────────────────────────
-- Substituir 'PLACEHOLDER' pelo chat_id real após criar o canal no Telegram.
INSERT INTO channels (slug, telegram_chat_id, display_name)
VALUES ('main', 'PLACEHOLDER', 'TechGarimpeiro')
ON CONFLICT DO NOTHING;

-- ── Discovery queries iniciais — nicho tech ───────────────────────────────────
INSERT INTO discovery_queries (store_slug, label, params, priority) VALUES
  ('aliexpress', 'Smartphones',
    '{"keywords":["smartphone"],"categoryIds":["509"],"minOrders":500,"sort":"volume_desc","limit":50}'::jsonb,
    10),
  ('aliexpress', 'Fones bluetooth',
    '{"keywords":["earbuds","fone bluetooth"],"categoryIds":["44"],"sort":"discount_desc","limit":40}'::jsonb,
    8),
  ('aliexpress', 'Smartwatches',
    '{"keywords":["smartwatch"],"categoryIds":["44"],"sort":"volume_desc","limit":30}'::jsonb,
    7),
  ('aliexpress', 'SSDs e armazenamento',
    '{"keywords":["ssd","hd externo"],"categoryIds":["7"],"sort":"discount_desc","limit":30}'::jsonb,
    6),
  ('aliexpress', 'Smart home',
    '{"keywords":["smart home","alexa","tuya"],"categoryIds":["1420"],"sort":"volume_desc","limit":30}'::jsonb,
    5),
  ('aliexpress', 'Periféricos PC',
    '{"keywords":["mouse gamer","teclado mecanico"],"categoryIds":["7"],"sort":"discount_desc","limit":30}'::jsonb,
    5)
ON CONFLICT DO NOTHING;
