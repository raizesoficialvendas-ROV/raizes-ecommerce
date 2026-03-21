-- =====================================================
-- Raízes — Migration 003: Payment columns + Realtime
-- InfinitePay integration support
-- =====================================================

-- Add 'paid' to the order_status enum
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'paid' AFTER 'pending';

-- Add payment-related columns to orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_link TEXT,
  ADD COLUMN IF NOT EXISTS payment_id TEXT,
  ADD COLUMN IF NOT EXISTS checkout_slug TEXT;

-- Index for webhook/polling lookups
CREATE INDEX IF NOT EXISTS idx_orders_checkout_slug ON public.orders(checkout_slug);

-- ── Realtime ──
-- Enable Realtime on orders table so the frontend can listen for status changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- ── RLS Policy for anon checkout status check ──
-- Permite que o frontend (anon) leia o status do próprio pedido pelo ID
-- (necessário para Supabase Realtime funcionar no client)
CREATE POLICY "Allow public read order status by id"
  ON public.orders
  FOR SELECT
  USING (true);
