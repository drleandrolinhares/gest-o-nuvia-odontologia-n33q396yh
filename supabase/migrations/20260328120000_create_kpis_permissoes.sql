CREATE TABLE IF NOT EXISTS public.kpis_permissoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cargo_id UUID NOT NULL REFERENCES public.cargos(id) ON DELETE CASCADE,
  kpi_id UUID NOT NULL REFERENCES public.kpis(id) ON DELETE CASCADE,
  pode_visualizar BOOLEAN NOT NULL DEFAULT false,
  pode_editar BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(cargo_id, kpi_id)
);

ALTER TABLE public.kpis_permissoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all authenticated users on kpis_permissoes" ON public.kpis_permissoes;
CREATE POLICY "Allow all authenticated users on kpis_permissoes" ON public.kpis_permissoes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed some initial KPIs if none exist, so the permissions page has data
DO $
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.kpis LIMIT 1) THEN
    INSERT INTO public.kpis (id, sector, name, target_value, current_value, format_type)
    VALUES 
      (gen_random_uuid(), 'COMERCIAL', 'Vendas Convertidas', 50000, 35000, 'currency'),
      (gen_random_uuid(), 'RECEPÇÃO', 'Novos Contatos', 100, 85, 'number'),
      (gen_random_uuid(), 'ADMINISTRATIVO', 'Redução de Custos', 10000, 12000, 'currency');
  END IF;
END $;
