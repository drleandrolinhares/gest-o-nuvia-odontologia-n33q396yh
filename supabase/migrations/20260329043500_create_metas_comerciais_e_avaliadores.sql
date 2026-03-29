CREATE TABLE IF NOT EXISTS public.dentistas_avaliadores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    cargo TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT dentistas_avaliadores_usuario_id_key UNIQUE (usuario_id)
);

CREATE TABLE IF NOT EXISTS public.metas_comerciais_empresa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mes INT NOT NULL,
    ano INT NOT NULL,
    meta_vendas NUMERIC NOT NULL DEFAULT 0,
    meta_ticket NUMERIC NOT NULL DEFAULT 0,
    meta_conversao NUMERIC NOT NULL DEFAULT 0,
    meta_entrada NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT metas_comerciais_empresa_mes_ano_key UNIQUE (mes, ano)
);

CREATE TABLE IF NOT EXISTS public.metas_comerciais_individual (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mes INT NOT NULL,
    ano INT NOT NULL,
    meta_vendas NUMERIC NOT NULL DEFAULT 0,
    meta_ticket NUMERIC NOT NULL DEFAULT 0,
    meta_conversao NUMERIC NOT NULL DEFAULT 0,
    meta_entrada NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT metas_comerciais_individual_usuario_id_mes_ano_key UNIQUE (usuario_id, mes, ano)
);

ALTER TABLE public.dentistas_avaliadores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "dentistas_avaliadores_all" ON public.dentistas_avaliadores;
CREATE POLICY "dentistas_avaliadores_all" ON public.dentistas_avaliadores FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.metas_comerciais_empresa ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "metas_comerciais_empresa_all" ON public.metas_comerciais_empresa;
CREATE POLICY "metas_comerciais_empresa_all" ON public.metas_comerciais_empresa FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.metas_comerciais_individual ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "metas_comerciais_individual_all" ON public.metas_comerciais_individual;
CREATE POLICY "metas_comerciais_individual_all" ON public.metas_comerciais_individual FOR ALL TO authenticated USING (true) WITH CHECK (true);
