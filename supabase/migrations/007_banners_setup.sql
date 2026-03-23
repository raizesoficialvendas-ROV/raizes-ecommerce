-- Create banners table
CREATE TABLE IF NOT EXISTS public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL UNIQUE, -- e.g. 'hero', 'manifesto'
  image_desktop_url text,
  image_mobile_url text,
  link_url text,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Turn on RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Banners são visíveis para todos" 
  ON public.banners FOR SELECT 
  USING (true);

-- Allow admin full access
CREATE POLICY "Admins podem gerenciar banners" 
  ON public.banners FOR ALL 
  USING (
    auth.role() = 'authenticated' AND 
    (auth.jwt() ->> 'email') IN (
      'raizesoficialvendas@gmail.com',
      'suporte@raizes-ecommerce.com'
    )
  );

-- Create storage bucket for banners
INSERT INTO storage.buckets (id, name, public) 
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for banners bucket
CREATE POLICY "Imagens de banners são públicas" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'banners');

CREATE POLICY "Admins podem gerenciar imagens de banners" 
  ON storage.objects FOR ALL 
  USING (
    bucket_id = 'banners' AND 
    auth.role() = 'authenticated' AND 
    (auth.jwt() ->> 'email') IN (
      'raizesoficialvendas@gmail.com',
      'suporte@raizes-ecommerce.com'
    )
  );

-- Pre-populate the two requested banners (if not exists)
INSERT INTO public.banners (section) VALUES ('hero') ON CONFLICT (section) DO NOTHING;
INSERT INTO public.banners (section) VALUES ('manifesto') ON CONFLICT (section) DO NOTHING;
