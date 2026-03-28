DO $$ 
BEGIN
    -- Add JSON columns to existing KPI tables to support dynamic module structures
    -- These align with the requested kpis_cargos and kpis_dados requirements
    ALTER TABLE public.kpis_config ADD COLUMN IF NOT EXISTS campos_json JSONB DEFAULT '{}'::jsonb;
    ALTER TABLE public.kpis_dados ADD COLUMN IF NOT EXISTS valores_json JSONB DEFAULT '{}'::jsonb;

    -- Ensure RLS policies are permissive for authenticated users
    DROP POLICY IF EXISTS "Allow authenticated all kpis_config" ON public.kpis_config;
    CREATE POLICY "Allow authenticated all kpis_config" ON public.kpis_config 
        FOR ALL TO authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow authenticated all kpis_dados" ON public.kpis_dados;
    CREATE POLICY "Allow authenticated all kpis_dados" ON public.kpis_dados 
        FOR ALL TO authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow all authenticated users on kpis_permissoes" ON public.kpis_permissoes;
    CREATE POLICY "Allow all authenticated users on kpis_permissoes" ON public.kpis_permissoes 
        FOR ALL TO authenticated USING (true) WITH CHECK (true);
END $$;
