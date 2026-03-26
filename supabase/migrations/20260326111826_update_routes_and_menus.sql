DO $$
BEGIN
  -- Create mapping table for routing documentation and historical reference
  CREATE TABLE IF NOT EXISTS public.route_migrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    old_route TEXT NOT NULL,
    new_route TEXT NOT NULL,
    migrated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Insert mappings
  INSERT INTO public.route_migrations (old_route, new_route) VALUES
    ('/admin/dashboard', '/admin/administrativo/dashboards'),
    ('/admin/rh', '/admin/administrativo/usuarios-rh'),
    ('/admin/rh/escala', '/admin/administrativo/escala-trabalho'),
    ('/admin/estoque', '/admin/financeiro/estoque'),
    ('/admin/precificacao', '/admin/administrativo/precificacao'),
    ('/admin/operacao/negociacao', '/admin/comercial/negociacao'),
    ('/admin/operacao/segmentacao', '/admin/administrativo/segmentacao-agenda'),
    ('/admin/configuracoes', '/admin/sistema/configuracoes'),
    ('/admin/permissoes', '/admin/sistema/permissoes'),
    ('/admin/auditoria', '/admin/sistema/logs'),
    ('/admin/acessos', '/admin/financeiro/central-acessos')
  ON CONFLICT DO NOTHING;

  -- Update any system pages or modules if they exist in DB to match new normalized routing
  UPDATE public.sys_pages SET route = '/admin/administrativo/dashboards' WHERE route = '/admin/dashboard';
  UPDATE public.sys_pages SET route = '/admin/administrativo/usuarios-rh' WHERE route = '/admin/rh';
  UPDATE public.sys_pages SET route = '/admin/administrativo/escala-trabalho' WHERE route = '/admin/rh/escala';
  UPDATE public.sys_pages SET route = '/admin/financeiro/estoque' WHERE route = '/admin/estoque';
  UPDATE public.sys_pages SET route = '/admin/administrativo/precificacao' WHERE route = '/admin/precificacao';
  UPDATE public.sys_pages SET route = '/admin/comercial/negociacao' WHERE route = '/admin/operacao/negociacao';
  UPDATE public.sys_pages SET route = '/admin/administrativo/segmentacao-agenda' WHERE route = '/admin/operacao/segmentacao';
  UPDATE public.sys_pages SET route = '/admin/sistema/configuracoes' WHERE route = '/admin/configuracoes';
  UPDATE public.sys_pages SET route = '/admin/sistema/permissoes' WHERE route = '/admin/permissoes';
  UPDATE public.sys_pages SET route = '/admin/sistema/logs' WHERE route = '/admin/auditoria';
  UPDATE public.sys_pages SET route = '/admin/financeiro/central-acessos' WHERE route = '/admin/acessos';

  -- Update sys_modules if they exist
  UPDATE public.sys_modules SET route = '/admin/administrativo/dashboards' WHERE route = '/admin/dashboard';
  UPDATE public.sys_modules SET route = '/admin/administrativo/usuarios-rh' WHERE route = '/admin/rh';
END $$;
