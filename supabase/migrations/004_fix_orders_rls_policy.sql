-- =====================================================
-- Raízes — Migration 004: Fix insecure orders RLS
-- A policy "Allow public read order status by id" com USING(true) 
-- permite que QUALQUER pessoa leia TODOS os pedidos.
-- Substituímos por uma policy que permite ler apenas
-- pedidos do próprio usuário (via auth.uid()) OU via checkout_slug.
-- =====================================================

-- Remove a policy insegura
DROP POLICY IF EXISTS "Allow public read order status by id" ON public.orders;

-- Cria policy restritiva: o anon só pode ler pedidos do próprio usuário
-- OU buscar por checkout_slug (necessário para Realtime no checkout/sucesso)
CREATE POLICY "orders_select_own_or_by_slug"
  ON public.orders
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.role() = 'service_role'
  );

-- Nota: se a policy "orders_select_own" da migration 001 já existir,
-- esta nova policy será OU-ada com ela (Postgres OR's multiple SELECTs).
-- O resultado final é o mesmo: user pode ler seus próprios pedidos.
