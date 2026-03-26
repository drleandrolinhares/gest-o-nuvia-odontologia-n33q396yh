CREATE TABLE IF NOT EXISTS public.routes_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    old_route TEXT NOT NULL UNIQUE,
    new_route TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.routes_mapping ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select" ON public.routes_mapping;
CREATE POLICY "authenticated_select" ON public.routes_mapping
    FOR SELECT TO authenticated USING (true);

INSERT INTO public.routes_mapping (old_route, new_route) VALUES
    ('/admin', '/'),
    ('/admin/dashboard', '/dashboard'),
    ('/admin/agenda', '/agenda'),
    ('/admin/chat', '/chat'),
    ('/admin/sac', '/sac'),
    ('/admin/negociacao', '/negociacao'),
    ('/admin/gestao-fiscal', '/gestao-fiscal'),
    ('/admin/acessos', '/acessos'),
    ('/admin/estoque', '/estoque'),
    ('/admin/kpis', '/kpis'),
    ('/admin/rh', '/rh'),
    ('/admin/rh/escala', '/rh/escala'),
    ('/admin/precificacao', '/precificacao'),
    ('/admin/segmentacao-agenda', '/segmentacao-agenda'),
    ('/admin/configuracoes', '/configuracoes'),
    ('/admin/permissoes', '/permissoes'),
    ('/admin/logs', '/logs'),
    ('/admin/hub/mural', '/hub/mural'),
    ('/admin/hub/feedback', '/hub/feedback'),
    ('/admin/hub/performance', '/hub/performance'),
    ('/admin/hub/ranking', '/hub/ranking')
ON CONFLICT (old_route) DO NOTHING;

DO $$ 
BEGIN
    -- Update role_permissions
    UPDATE public.role_permissions
    SET module = REPLACE(module, '/admin/', '/')
    WHERE module LIKE '/admin/%';
    
    UPDATE public.role_permissions
    SET module = '/'
    WHERE module = '/admin';

    -- Update user_permissions
    UPDATE public.user_permissions
    SET module = REPLACE(module, '/admin/', '/')
    WHERE module LIKE '/admin/%';
    
    UPDATE public.user_permissions
    SET module = '/'
    WHERE module = '/admin';

    -- Update sys_modules
    UPDATE public.sys_modules
    SET route = REPLACE(route, '/admin/', '/')
    WHERE route LIKE '/admin/%';
    
    UPDATE public.sys_modules
    SET route = '/'
    WHERE route = '/admin';

    -- Update sys_pages
    UPDATE public.sys_pages
    SET route = REPLACE(route, '/admin/', '/')
    WHERE route LIKE '/admin/%';
    
    UPDATE public.sys_pages
    SET route = '/'
    WHERE route = '/admin';

    -- Update menu_configurations
    UPDATE public.menu_configurations
    SET link = REPLACE(link, '/admin/', '/')
    WHERE link LIKE '/admin/%';
    
    UPDATE public.menu_configurations
    SET link = '/'
    WHERE link = '/admin';
END $$;
