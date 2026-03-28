-- Cria a tabela base para configurações de KPIs
CREATE TABLE IF NOT EXISTS public.kpis_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cargo_id UUID REFERENCES public.cargos(id) ON DELETE CASCADE,
    nome_kpi TEXT NOT NULL,
    unidade TEXT NOT NULL,
    meta_padrao NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cria a tabela para registro de dados históricos dos KPIs
CREATE TABLE IF NOT EXISTS public.kpis_dados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_id UUID REFERENCES public.kpis_config(id) ON DELETE CASCADE,
    cargo_id UUID REFERENCES public.cargos(id) ON DELETE CASCADE,
    valor_atual NUMERIC NOT NULL DEFAULT 0,
    data DATE NOT NULL,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Limpa a tabela de permissões antiga para evitar conflitos de FK
TRUNCATE TABLE public.kpis_permissoes;

-- Atualiza a foreign key de kpis_permissoes para apontar para a nova tabela kpis_config
ALTER TABLE public.kpis_permissoes DROP CONSTRAINT IF EXISTS kpis_permissoes_kpi_id_fkey;
ALTER TABLE public.kpis_permissoes ADD CONSTRAINT kpis_permissoes_kpi_id_fkey FOREIGN KEY (kpi_id) REFERENCES public.kpis_config(id) ON DELETE CASCADE;

-- Habilita RLS nas novas tabelas
ALTER TABLE public.kpis_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpis_dados ENABLE ROW LEVEL SECURITY;

-- Aplica políticas de segurança
DROP POLICY IF EXISTS "Allow authenticated all kpis_config" ON public.kpis_config;
CREATE POLICY "Allow authenticated all kpis_config" ON public.kpis_config 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated all kpis_dados" ON public.kpis_dados;
CREATE POLICY "Allow authenticated all kpis_dados" ON public.kpis_dados 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
