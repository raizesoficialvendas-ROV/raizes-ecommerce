-- =====================================================
-- Raízes — Schema Completo do Banco de Dados
-- Migração: 001_initial_schema
-- =====================================================

-- Habilita extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE product_status AS ENUM ('draft', 'published');

CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

-- =====================================================
-- TABELA: categories
-- =====================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  image_url    TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice no slug para queries de navegação
CREATE INDEX idx_categories_slug ON public.categories(slug);

-- Comentários
COMMENT ON TABLE  public.categories          IS 'Categorias de produtos da loja Raízes';
COMMENT ON COLUMN public.categories.slug     IS 'Slug URL-friendly único (ex: camisetas, calcas)';
COMMENT ON COLUMN public.categories.image_url IS 'URL da imagem de capa da categoria no Supabase Storage';

-- =====================================================
-- TABELA: products
-- =====================================================

CREATE TABLE IF NOT EXISTS public.products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  description      TEXT,
  price            NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock_quantity   INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  category_id      UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  images_urls      TEXT[],
  metadata         JSONB DEFAULT '{}'::jsonb,
  status           product_status NOT NULL DEFAULT 'draft',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_status      ON public.products(status);
CREATE INDEX idx_products_price       ON public.products(price);
CREATE INDEX idx_products_metadata    ON public.products USING gin(metadata);

-- Comentários
COMMENT ON TABLE  public.products              IS 'Catálogo de produtos da loja Raízes';
COMMENT ON COLUMN public.products.price        IS 'Preço em BRL (Real Brasileiro), formato NUMERIC(10,2)';
COMMENT ON COLUMN public.products.images_urls  IS 'Array de URLs das imagens do produto no Supabase Storage';
COMMENT ON COLUMN public.products.metadata     IS 'Especificações técnicas e dados extras em formato JSONB (ex: cor, material, tamanho)';
COMMENT ON COLUMN public.products.status       IS 'draft = rascunho (invisível), published = publicado (visível na loja)';

-- =====================================================
-- TABELA: orders
-- =====================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status          order_status NOT NULL DEFAULT 'pending',
  total_amount    NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  shipping_cost   NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  tracking_code   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_orders_user_id    ON public.orders(user_id);
CREATE INDEX idx_orders_status     ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- Comentários
COMMENT ON TABLE  public.orders                IS 'Pedidos realizados pelos usuários';
COMMENT ON COLUMN public.orders.user_id        IS 'FK para auth.users do Supabase Auth';
COMMENT ON COLUMN public.orders.total_amount   IS 'Valor total do pedido (itens + frete)';
COMMENT ON COLUMN public.orders.shipping_cost  IS 'Custo de frete separado';
COMMENT ON COLUMN public.orders.tracking_code  IS 'Código de rastreio dos Correios / transportadora';

-- =====================================================
-- TABELA: order_items
-- =====================================================

CREATE TABLE IF NOT EXISTS public.order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id   UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  unit_price   NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_order_items_order_id   ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

-- Comentários
COMMENT ON TABLE  public.order_items            IS 'Itens individuais de cada pedido';
COMMENT ON COLUMN public.order_items.unit_price IS 'Preço unitário no momento da compra (snapshot — não usa FK de preço)';

-- =====================================================
-- TRIGGER: updated_at automático
-- =====================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- -----------------------------------
-- POLICIES: categories
-- Leitura pública, escrita apenas para admins (service_role)
-- -----------------------------------
CREATE POLICY "categories_select_public"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "categories_insert_admin"
  ON public.categories FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "categories_update_admin"
  ON public.categories FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "categories_delete_admin"
  ON public.categories FOR DELETE
  USING (auth.role() = 'service_role');

-- -----------------------------------
-- POLICIES: products
-- Leitura pública de produtos publicados, escrita apenas para admins
-- -----------------------------------
CREATE POLICY "products_select_published"
  ON public.products FOR SELECT
  USING (status = 'published' OR auth.role() = 'service_role');

CREATE POLICY "products_insert_admin"
  ON public.products FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "products_update_admin"
  ON public.products FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "products_delete_admin"
  ON public.products FOR DELETE
  USING (auth.role() = 'service_role');

-- -----------------------------------
-- POLICIES: orders
-- Usuário vê e altera apenas seus próprios pedidos; admins veem tudo
-- -----------------------------------
CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.role() = 'service_role'
  );

CREATE POLICY "orders_insert_authenticated"
  ON public.orders FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR auth.role() = 'service_role'
  );

CREATE POLICY "orders_update_own_or_admin"
  ON public.orders FOR UPDATE
  USING (
    auth.uid() = user_id
    OR auth.role() = 'service_role'
  );

CREATE POLICY "orders_delete_admin"
  ON public.orders FOR DELETE
  USING (auth.role() = 'service_role');

-- -----------------------------------
-- POLICIES: order_items
-- Acesso vinculado ao dono do pedido
-- -----------------------------------
CREATE POLICY "order_items_select_own"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR auth.role() = 'service_role')
    )
  );

CREATE POLICY "order_items_insert_authenticated"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR auth.role() = 'service_role')
    )
  );

CREATE POLICY "order_items_delete_admin"
  ON public.order_items FOR DELETE
  USING (auth.role() = 'service_role');

-- =====================================================
-- SEED: Categorias iniciais (opcional)
-- =====================================================

INSERT INTO public.categories (name, slug, image_url) VALUES
  ('Camisetas',    'camisetas',    NULL),
  ('Calças',       'calcas',       NULL),
  ('Vestidos',     'vestidos',     NULL),
  ('Acessórios',   'acessorios',   NULL),
  ('Calçados',     'calcados',     NULL),
  ('Coleção',      'colecao',      NULL)
ON CONFLICT (slug) DO NOTHING;
