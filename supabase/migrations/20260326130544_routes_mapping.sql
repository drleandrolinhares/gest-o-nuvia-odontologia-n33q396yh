CREATE TABLE IF NOT EXISTS public.routes_mapping (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  old_route text NOT NULL,
  new_route text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$ 
BEGIN
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
  ('/admin/logs', '/logs')
  ON CONFLICT DO NOTHING;
END $$;

UPDATE public.sys_modules SET route = REPLACE(route, '/admin/', '/') WHERE route LIKE '/admin/%';
UPDATE public.sys_modules SET route = '/' WHERE route = '/admin';

UPDATE public.sys_pages SET route = REPLACE(route, '/admin/', '/') WHERE route LIKE '/admin/%';
UPDATE public.sys_pages SET route = '/' WHERE route = '/admin';
