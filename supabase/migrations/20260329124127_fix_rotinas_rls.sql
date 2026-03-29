DO $$
BEGIN
    -- Fix rotinas_pontos RLS
    DROP POLICY IF EXISTS "rotinas_pontos_insert" ON public.rotinas_pontos;
    CREATE POLICY "rotinas_pontos_insert" ON public.rotinas_pontos
    FOR INSERT TO authenticated
    WITH CHECK (
        usuario_id = auth.uid() OR 
        is_admin_user(auth.uid()) OR 
        is_master_user(auth.uid()) OR
        EXISTS (SELECT 1 FROM public.profiles p JOIN public.cargos c ON p.cargo_id = c.id WHERE p.id = auth.uid() AND c.nome = 'CEO')
    );

    DROP POLICY IF EXISTS "rotinas_pontos_update" ON public.rotinas_pontos;
    CREATE POLICY "rotinas_pontos_update" ON public.rotinas_pontos
    FOR UPDATE TO authenticated
    USING (
        usuario_id = auth.uid() OR 
        is_admin_user(auth.uid()) OR 
        is_master_user(auth.uid()) OR
        EXISTS (SELECT 1 FROM public.profiles p JOIN public.cargos c ON p.cargo_id = c.id WHERE p.id = auth.uid() AND c.nome = 'CEO')
    );

    DROP POLICY IF EXISTS "rotinas_pontos_delete" ON public.rotinas_pontos;
    CREATE POLICY "rotinas_pontos_delete" ON public.rotinas_pontos
    FOR DELETE TO authenticated
    USING (
        usuario_id = auth.uid() OR 
        is_admin_user(auth.uid()) OR 
        is_master_user(auth.uid()) OR
        EXISTS (SELECT 1 FROM public.profiles p JOIN public.cargos c ON p.cargo_id = c.id WHERE p.id = auth.uid() AND c.nome = 'CEO')
    );

    -- Fix rotinas_execucao RLS
    DROP POLICY IF EXISTS "rotinas_execucao_insert" ON public.rotinas_execucao;
    CREATE POLICY "rotinas_execucao_insert" ON public.rotinas_execucao
    FOR INSERT TO authenticated
    WITH CHECK (
        usuario_id = auth.uid() OR 
        is_admin_user(auth.uid()) OR 
        is_master_user(auth.uid()) OR
        EXISTS (SELECT 1 FROM public.profiles p JOIN public.cargos c ON p.cargo_id = c.id WHERE p.id = auth.uid() AND c.nome = 'CEO')
    );

    DROP POLICY IF EXISTS "rotinas_execucao_update" ON public.rotinas_execucao;
    CREATE POLICY "rotinas_execucao_update" ON public.rotinas_execucao
    FOR UPDATE TO authenticated
    USING (
        usuario_id = auth.uid() OR 
        is_admin_user(auth.uid()) OR 
        is_master_user(auth.uid()) OR
        EXISTS (SELECT 1 FROM public.profiles p JOIN public.cargos c ON p.cargo_id = c.id WHERE p.id = auth.uid() AND c.nome = 'CEO')
    );

    DROP POLICY IF EXISTS "rotinas_execucao_delete" ON public.rotinas_execucao;
    CREATE POLICY "rotinas_execucao_delete" ON public.rotinas_execucao
    FOR DELETE TO authenticated
    USING (
        usuario_id = auth.uid() OR 
        is_admin_user(auth.uid()) OR 
        is_master_user(auth.uid()) OR
        EXISTS (SELECT 1 FROM public.profiles p JOIN public.cargos c ON p.cargo_id = c.id WHERE p.id = auth.uid() AND c.nome = 'CEO')
    );

END $$;
