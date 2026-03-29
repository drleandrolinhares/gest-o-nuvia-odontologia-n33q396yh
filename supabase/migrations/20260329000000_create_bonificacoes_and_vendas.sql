-- Create the tables
CREATE TABLE IF NOT EXISTS public.bonificacoes_criterios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cargo_id UUID REFERENCES public.cargos(id) ON DELETE CASCADE,
  nome_criterio TEXT NOT NULL,
  valor_referencia NUMERIC NOT NULL DEFAULT 0,
  valor_remuneracao NUMERIC NOT NULL DEFAULT 0,
  editavel_admin BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bonificacoes_criterios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all authenticated users on bonificacoes_criterios" ON public.bonificacoes_criterios;
CREATE POLICY "Allow all authenticated users on bonificacoes_criterios" ON public.bonificacoes_criterios
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.bonificacoes_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cargo_id UUID REFERENCES public.cargos(id) ON DELETE CASCADE,
  data_vencimento_pagamento DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bonificacoes_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all authenticated users on bonificacoes_config" ON public.bonificacoes_config;
CREATE POLICY "Allow all authenticated users on bonificacoes_config" ON public.bonificacoes_config
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.vendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dentista_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  crc_comercial_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  paciente TEXT,
  valor_orcamento NUMERIC NOT NULL DEFAULT 0,
  valor_venda NUMERIC NOT NULL DEFAULT 0,
  valor_entrada NUMERIC NOT NULL DEFAULT 0,
  percentual_entrada NUMERIC NOT NULL DEFAULT 0,
  tipo_venda TEXT,
  data_venda DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'ORÇAMENTO',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.vendas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all authenticated users on vendas" ON public.vendas;
CREATE POLICY "Allow all authenticated users on vendas" ON public.vendas
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Migrate existing mock data from kpis_dados to vendas
DO $$
DECLARE
  k record;
  d_id uuid;
  c_id uuid;
BEGIN
  FOR k IN 
    SELECT id, data, valores_json 
    FROM public.kpis_dados 
    WHERE kpi_id IN (SELECT id FROM public.kpis_config WHERE nome_kpi = 'CRM_COMERCIAL')
  LOOP
    BEGIN
      d_id := NULLIF(BTRIM(k.valores_json->>'dentista_id'), '')::uuid;
    EXCEPTION WHEN others THEN d_id := NULL; END;
    
    BEGIN
      c_id := NULLIF(BTRIM(k.valores_json->>'crc_comercial_id'), '')::uuid;
    EXCEPTION WHEN others THEN c_id := NULL; END;

    INSERT INTO public.vendas (
      id,
      dentista_id,
      crc_comercial_id,
      paciente,
      valor_orcamento,
      valor_venda,
      valor_entrada,
      percentual_entrada,
      tipo_venda,
      data_venda,
      status
    ) VALUES (
      k.id,
      d_id,
      c_id,
      k.valores_json->>'paciente',
      COALESCE((k.valores_json->>'valor')::numeric, 0),
      COALESCE((k.valores_json->>'valor_venda')::numeric, 0),
      COALESCE((k.valores_json->>'valor_entrada')::numeric, 0),
      COALESCE((k.valores_json->>'percentual_entrada')::numeric, 0),
      k.valores_json->>'origem_venda',
      k.data,
      CASE WHEN (k.valores_json->>'vendido')::boolean THEN 'VENDIDO' ELSE 'ORÇAMENTO' END
    ) ON CONFLICT (id) DO NOTHING;
  END LOOP;
END $$;
