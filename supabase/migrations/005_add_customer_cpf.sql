-- =====================================================
-- Raízes — Migration 005: Add customer CPF + ME shipment ID
-- Required by Melhor Envio for shipment creation
-- =====================================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_cpf TEXT;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS melhor_envio_shipment_id TEXT;

-- Index for potential CPF lookups
CREATE INDEX IF NOT EXISTS idx_orders_customer_cpf ON public.orders(customer_cpf);
