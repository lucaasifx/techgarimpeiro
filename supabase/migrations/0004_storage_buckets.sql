-- Migration 0004 — Storage Buckets

-- Bucket público para imagens cacheadas de produtos
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket privado para Playwright session storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('scraper-sessions', 'scraper-sessions', false)
ON CONFLICT (id) DO NOTHING;

-- Política de leitura pública para product-images
CREATE POLICY "product_images_public_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'product-images');
