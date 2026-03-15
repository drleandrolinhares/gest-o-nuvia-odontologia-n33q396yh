CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  global_card_fee NUMERIC DEFAULT 0,
  global_commission NUMERIC DEFAULT 0,
  global_inadimplency NUMERIC DEFAULT 0,
  global_taxes NUMERIC DEFAULT 0,
  hourly_cost_fixed_items JSONB DEFAULT '[]'::jsonb,
  hourly_cost_monthly_hours NUMERIC DEFAULT 160,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users" ON public.app_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO public.app_settings (global_card_fee, global_commission, global_inadimplency, global_taxes, hourly_cost_monthly_hours) VALUES (0, 0, 0, 0, 160);

CREATE TABLE public.price_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_type TEXT NOT NULL,
  category TEXT NOT NULL,
  material TEXT,
  price NUMERIC DEFAULT 0,
  sector TEXT,
  execution_time INTEGER DEFAULT 0,
  cadista_cost NUMERIC DEFAULT 0,
  material_cost NUMERIC DEFAULT 0,
  fixed_cost NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.price_list ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users" ON public.price_list FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.price_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price_list_id UUID REFERENCES public.price_list(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  percentage NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.price_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users" ON public.price_stages FOR ALL TO authenticated USING (true) WITH CHECK (true);

