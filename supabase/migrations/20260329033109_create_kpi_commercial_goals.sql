CREATE TABLE IF NOT EXISTS public.kpi_company_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period TEXT NOT NULL UNIQUE,
  sales_total_target NUMERIC NOT NULL DEFAULT 0,
  average_ticket_target NUMERIC NOT NULL DEFAULT 0,
  conversion_target_percent NUMERIC NOT NULL DEFAULT 0,
  entry_target_percent NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kpi_individual_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period TEXT NOT NULL,
  sales_target NUMERIC NOT NULL DEFAULT 0,
  average_ticket_target NUMERIC NOT NULL DEFAULT 0,
  conversion_target_percent NUMERIC NOT NULL DEFAULT 0,
  entry_target_percent NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, period)
);

ALTER TABLE public.kpi_company_goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "kpi_company_goals_all" ON public.kpi_company_goals;
CREATE POLICY "kpi_company_goals_all" ON public.kpi_company_goals FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.kpi_individual_goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "kpi_individual_goals_all" ON public.kpi_individual_goals;
CREATE POLICY "kpi_individual_goals_all" ON public.kpi_individual_goals FOR ALL TO authenticated USING (true) WITH CHECK (true);
