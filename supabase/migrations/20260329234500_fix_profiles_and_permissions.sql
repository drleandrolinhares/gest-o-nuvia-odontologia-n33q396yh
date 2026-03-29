DO $$
DECLARE
  u RECORD;
BEGIN
  -- 1. Ensure all auth.users have a profile
  FOR u IN SELECT id, email FROM auth.users LOOP
    INSERT INTO public.profiles (id, email, nome)
    VALUES (u.id, u.email, 'Usuário ' || substr(u.id::text, 1, 4))
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
  
  -- 2. Ensure all profiles have at least one user_cargo
  IF NOT EXISTS (SELECT 1 FROM public.cargos WHERE nome = 'COLABORADOR') THEN
    INSERT INTO public.cargos (nome, descricao) VALUES ('COLABORADOR', 'Cargo padrão do sistema');
  END IF;

  FOR u IN 
    SELECT p.id FROM public.profiles p 
    LEFT JOIN public.user_cargos uc ON uc.user_id = p.id AND uc.is_principal = true 
    WHERE uc.id IS NULL 
  LOOP
    INSERT INTO public.user_cargos (user_id, cargo_id, cargo, is_principal)
    SELECT u.id, c.id, c.nome, true
    FROM public.cargos c
    WHERE c.nome = 'COLABORADOR'
    LIMIT 1;
  END LOOP;
  
  -- 3. Fix any missing menus in menus_sistema for default modules
  INSERT INTO public.menus_sistema (nome, rota) VALUES
  ('DASHBOARD', '/dashboard'),
  ('OPERACIONAL', NULL),
  ('SAC', '/sac'),
  ('ROTINA DIÁRIA', '/rotina-diaria'),
  ('PERFORMANCE', '/performance'),
  ('COMUNICADOS', '/comunicados'),
  ('AVISOS E RECADOS', '/avisos-e-recados'),
  ('COMERCIAL', NULL),
  ('GESTÃO DE VENDAS', '/gestao-de-vendas'),
  ('NEGOCIAÇÃO', '/negociacao'),
  ('GESTÃO FISCAL', '/gestao-fiscal'),
  ('FINANCEIRO', NULL),
  ('CENTRAL DE ACESSOS', '/central-de-acessos'),
  ('ESTOQUE', '/estoque'),
  ('ADMINISTRATIVO', NULL),
  ('KPIS', '/kpis'),
  ('USUÁRIOS', '/usuarios'),
  ('ESCALA DE TRABALHO', '/escala-de-trabalho'),
  ('PRECIFICAÇÃO', '/precificacao'),
  ('SEGMENTAÇÃO DA AGENDA', '/segmentacao-agenda'),
  ('SISTEMA', NULL),
  ('CONFIGURAÇÕES', '/configuracoes'),
  ('PERMISSÕES', '/permissoes'),
  ('LOGS', '/logs'),
  ('DEBUG', '/debug')
  ON CONFLICT (nome) DO NOTHING;
  
  -- 4. Give full permissions to ADMIN and MASTER cargos
  INSERT INTO public.permissoes_cargo (cargo_id, menu_id, pode_ver, pode_criar, pode_editar, pode_deletar)
  SELECT c.id, m.id, true, true, true, true
  FROM public.cargos c
  CROSS JOIN public.menus_sistema m
  WHERE c.nome IN ('ADMIN', 'MASTER', 'DIRETORIA', 'CEO')
  ON CONFLICT (cargo_id, menu_id) DO UPDATE SET
    pode_ver = true, pode_criar = true, pode_editar = true, pode_deletar = true;

END $$;
