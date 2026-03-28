-- Ensure suppliers table exists to prevent 404/CORS network errors
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  cnpj TEXT NOT NULL DEFAULT '',
  website TEXT,
  has_special_negotiation BOOLEAN DEFAULT false,
  negotiation_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all authenticated users" ON public.suppliers;
CREATE POLICY "Allow all authenticated users" ON public.suppliers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
