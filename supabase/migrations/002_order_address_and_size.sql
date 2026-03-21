-- =====================================================
-- Raízes — Migration 002: Order address fields + item size
-- Guest checkout support
-- =====================================================

-- Make user_id optional (guest checkout)
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- Add customer info fields
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Add address fields
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS address_cep TEXT,
  ADD COLUMN IF NOT EXISTS address_street TEXT,
  ADD COLUMN IF NOT EXISTS address_number TEXT,
  ADD COLUMN IF NOT EXISTS address_complement TEXT,
  ADD COLUMN IF NOT EXISTS address_neighborhood TEXT,
  ADD COLUMN IF NOT EXISTS address_city TEXT,
  ADD COLUMN IF NOT EXISTS address_state TEXT;

-- Add shipping service name
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_service TEXT;

-- Add size to order items
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS size TEXT;

-- Update RLS: allow inserts without user_id for guest checkout (via service_role)
-- Existing policies already allow service_role, so no changes needed.

-- Index on customer email for order lookups
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
