CREATE TABLE IF NOT EXISTS public.kpis_dentistas_avaliadores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT kpis_dentistas_avaliadores_user_id_key UNIQUE (user_id)
);

DROP POLICY IF EXISTS "Allow all authenticated users on kpis_dentistas_avaliadores" ON public.kpis_dentistas_avaliadores;

ALTER TABLE public.kpis_dentistas_avaliadores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users on kpis_dentistas_avaliadores" ON public.kpis_dentistas_avaliadores
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
