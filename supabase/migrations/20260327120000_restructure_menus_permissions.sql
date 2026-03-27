DO $
BEGIN
  -- 1. Add columns for hierarchy
  ALTER TABLE public.menus_sistema ADD COLUMN IF NOT EXISTS menu_pai TEXT;
  ALTER TABLE public.menus_sistema ADD COLUMN IF NOT EXISTS menu_filho TEXT;

  -- 2. Add action columns for "CRIAR"
  ALTER TABLE public.permissoes_cargo ADD COLUMN IF NOT EXISTS pode_criar BOOLEAN NOT NULL DEFAULT false;
  ALTER TABLE public.permissoes_usuario ADD COLUMN IF NOT EXISTS pode_criar BOOLEAN NOT NULL DEFAULT false;

  -- 3. Populate hierarchy data based on exact names from existing modules
  UPDATE public.menus_sistema SET menu_pai = 'OPERACIONAL', menu_filho = NULL WHERE nome = 'OPERACIONAL';
  UPDATE public.menus_sistema SET menu_pai = 'OPERACIONAL', menu_filho = 'SAC' WHERE nome = 'SAC';
  UPDATE public.menus_sistema SET menu_pai = 'OPERACIONAL', menu_filho = 'ROTINA DIÁRIA' WHERE nome = 'ROTINA DIÁRIA';
  UPDATE public.menus_sistema SET menu_pai = 'OPERACIONAL', menu_filho = 'MENSAGENS' WHERE nome = 'MENSAGENS';
  UPDATE public.menus_sistema SET menu_pai = 'OPERACIONAL', menu_filho = 'PERFORMANCE' WHERE nome = 'PERFORMANCE';
  UPDATE public.menus_sistema SET menu_pai = 'OPERACIONAL', menu_filho = 'COMUNICADOS' WHERE nome = 'COMUNICADOS';
  UPDATE public.menus_sistema SET menu_pai = 'OPERACIONAL', menu_filho = 'AVISOS E RECADOS' WHERE nome = 'AVISOS E RECADOS';

  UPDATE public.menus_sistema SET menu_pai = 'COMERCIAL', menu_filho = NULL WHERE nome = 'COMERCIAL';
  UPDATE public.menus_sistema SET menu_pai = 'COMERCIAL', menu_filho = 'NEGOCIAÇÃO' WHERE nome = 'NEGOCIAÇÃO';
  UPDATE public.menus_sistema SET menu_pai = 'COMERCIAL', menu_filho = 'GESTÃO FISCAL' WHERE nome = 'GESTÃO FISCAL';

  UPDATE public.menus_sistema SET menu_pai = 'FINANCEIRO', menu_filho = NULL WHERE nome = 'FINANCEIRO';
  UPDATE public.menus_sistema SET menu_pai = 'FINANCEIRO', menu_filho = 'CENTRAL DE ACESSOS' WHERE nome = 'CENTRAL DE ACESSOS';
  UPDATE public.menus_sistema SET menu_pai = 'FINANCEIRO', menu_filho = 'ESTOQUE' WHERE nome = 'ESTOQUE';

  UPDATE public.menus_sistema SET menu_pai = 'ADMINISTRATIVO', menu_filho = NULL WHERE nome = 'ADMINISTRATIVO';
  UPDATE public.menus_sistema SET menu_pai = 'ADMINISTRATIVO', menu_filho = 'DASHBOARD' WHERE nome = 'DASHBOARD';
  UPDATE public.menus_sistema SET menu_pai = 'ADMINISTRATIVO', menu_filho = 'KPIS' WHERE nome = 'KPIS';
  UPDATE public.menus_sistema SET menu_pai = 'ADMINISTRATIVO', menu_filho = 'USUÁRIOS' WHERE nome = 'USUÁRIOS';
  UPDATE public.menus_sistema SET menu_pai = 'ADMINISTRATIVO', menu_filho = 'ESCALA DE TRABALHO' WHERE nome = 'ESCALA DE TRABALHO';
  UPDATE public.menus_sistema SET menu_pai = 'ADMINISTRATIVO', menu_filho = 'PRECIFICAÇÃO' WHERE nome = 'PRECIFICAÇÃO';
  UPDATE public.menus_sistema SET menu_pai = 'ADMINISTRATIVO', menu_filho = 'SEGMENTAÇÃO DA AGENDA' WHERE nome = 'SEGMENTAÇÃO DA AGENDA';

  UPDATE public.menus_sistema SET menu_pai = 'SISTEMA', menu_filho = NULL WHERE nome = 'SISTEMA';
  UPDATE public.menus_sistema SET menu_pai = 'SISTEMA', menu_filho = 'CONFIGURAÇÕES' WHERE nome = 'CONFIGURAÇÕES';
  UPDATE public.menus_sistema SET menu_pai = 'SISTEMA', menu_filho = 'PERMISSÕES' WHERE nome = 'PERMISSÕES';
  UPDATE public.menus_sistema SET menu_pai = 'SISTEMA', menu_filho = 'LOGS' WHERE nome = 'LOGS';
  UPDATE public.menus_sistema SET menu_pai = 'SISTEMA', menu_filho = 'DEBUG' WHERE nome = 'DEBUG';

  -- 4. Clean up any unused or orphaned menus that don't belong to our standard hierarchy
  DELETE FROM public.menus_sistema WHERE menu_pai IS NULL;

END $;

