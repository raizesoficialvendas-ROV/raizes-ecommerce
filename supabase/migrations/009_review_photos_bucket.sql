-- ─────────────────────────────────────────────────────────────────────────────
-- 009_review_photos_bucket.sql — Bucket de Storage para fotos de avaliações
-- ─────────────────────────────────────────────────────────────────────────────

-- Cria o bucket se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos',
  true,
  5242880,  -- 5 MB por arquivo
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Política: qualquer um pode fazer upload (leitura pública)
CREATE POLICY "Upload público de fotos de avaliações"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'review-photos');

-- Política: leitura pública
CREATE POLICY "Leitura pública de fotos de avaliações"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-photos');

-- Política: admins podem deletar
CREATE POLICY "Admins podem deletar fotos de avaliações"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'review-photos' AND
    auth.role() = 'authenticated' AND
    (auth.jwt() ->> 'email') IN (
      'raizesoficialvendas@gmail.com',
      'suporte@raizes-ecommerce.com'
    )
  );
