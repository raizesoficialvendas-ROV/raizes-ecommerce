-- ─────────────────────────────────────────────────────────────────────────────
-- 008_reviews.sql — Sistema de avaliações de produtos
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.reviews (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id          uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  author_name         text NOT NULL,
  author_email        text NOT NULL,
  rating              integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title               text,
  body                text,
  -- 1=Ruim … 5=Excelente
  purchase_experience integer CHECK (purchase_experience >= 1 AND purchase_experience <= 5),
  -- 1=Muito pequeno … 5=Muito grande
  size_fit            integer CHECK (size_fit >= 1 AND size_fit <= 5),
  recommends          boolean,
  verified            boolean NOT NULL DEFAULT false,
  approved            boolean NOT NULL DEFAULT false,
  helpful_yes         integer NOT NULL DEFAULT 0,
  helpful_no          integer NOT NULL DEFAULT 0,
  photos              text[]  NOT NULL DEFAULT '{}',
  product_variant     text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Índice para queries por produto
CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON public.reviews (product_id);
CREATE INDEX IF NOT EXISTS reviews_approved_idx   ON public.reviews (approved);

-- RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Leitura pública (somente avaliações aprovadas)
CREATE POLICY "Avaliações aprovadas são públicas"
  ON public.reviews FOR SELECT
  USING (approved = true);

-- Qualquer visitante pode enviar (ficam pendentes de aprovação)
CREATE POLICY "Qualquer um pode enviar uma avaliação"
  ON public.reviews FOR INSERT
  WITH CHECK (true);

-- Admins têm acesso total
CREATE POLICY "Admins podem gerenciar avaliações"
  ON public.reviews FOR ALL
  USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() ->> 'email') IN (
      'raizesoficialvendas@gmail.com',
      'suporte@raizes-ecommerce.com'
    )
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_reviews_updated_at();
