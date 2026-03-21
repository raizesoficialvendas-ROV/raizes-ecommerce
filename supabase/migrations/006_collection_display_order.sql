-- =====================================================
-- Raízes — Adiciona display_order e description às coleções
-- Migração: 006_collection_display_order
-- =====================================================

-- Adiciona coluna de ordenação para controle da posição na homepage
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;

-- Adiciona descrição para exibição nas páginas de coleção
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Índice para ordenação rápida
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);

-- Atualiza coleções existentes com order sequencial
DO $$
DECLARE
  rec RECORD;
  i INTEGER := 0;
BEGIN
  FOR rec IN SELECT id FROM public.categories ORDER BY created_at ASC
  LOOP
    UPDATE public.categories SET display_order = i WHERE id = rec.id;
    i := i + 1;
  END LOOP;
END $$;

COMMENT ON COLUMN public.categories.display_order IS 'Ordem de exibição na homepage (0 = primeiro). Controlado via drag-and-drop no admin.';
COMMENT ON COLUMN public.categories.description   IS 'Descrição curta da coleção, exibida na página de coleções e na homepage.';
