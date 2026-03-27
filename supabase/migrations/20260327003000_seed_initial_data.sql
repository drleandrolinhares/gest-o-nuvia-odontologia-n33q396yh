DO $$ 
BEGIN
  -- 1. Insert into cargos
  INSERT INTO public.cargos (nome, descricao) VALUES
    ('ADMINISTRADOR', 'Acesso total ao sistema'),
    ('DENTISTA', 'Profissional de odontologia'),
    ('RECEPCIONISTA', 'Atendimento ao cliente e agendamentos'),
    ('GERENTE', 'Gestão operacional e administrativa'),
    ('AUXILIAR', 'Suporte geral e operacional')
  ON CONFLICT (nome) DO NOTHING;

  -- 2. Insert into departamentos
  INSERT INTO public.departamentos (nome) VALUES
    ('ADMINISTRATIVO'),
    ('OPERACIONAL'),
    ('FINANCEIRO'),
    ('LABORATORIO')
  ON CONFLICT (nome) DO NOTHING;

  -- 3. Insert into menus_sistema
  INSERT INTO public.menus_sistema (nome, rota, icone, ordem) VALUES
    ('COMERCIAL', NULL, 'Handshake', 10),
    ('NEGOCIAÇÃO', '/negociacao', 'Handshake', 11),
    ('GESTÃO FISCAL', '/gestao-fiscal', 'FileText', 12),
    ('FINANCEIRO', NULL, 'DollarSign', 20),
    ('CENTRAL DE ACESSOS', '/acessos', 'Key', 21),
    ('ESTOQUE', '/estoque', 'Package', 22),
    ('ADMINISTRATIVO', NULL, 'Briefcase', 30),
    ('DASHBOARDS', '/dashboard', 'LayoutDashboard', 31),
    ('KPIS', '/kpis', 'TrendingUp', 32),
    ('DOCUMENTOS', '/rh', 'File', 33),
    ('PRECIFICAÇÃO', '/precificacao', 'DollarSign', 34),
    ('SEGMENTAÇÃO DA AGENDA', '/segmentacao-agenda', 'CalendarDays', 35),
    ('SISTEMA', NULL, 'Settings', 40),
    ('CONFIGURAÇÕES', '/configuracoes', 'Settings', 41),
    ('LOGS', '/logs', 'ScrollText', 42),
    ('DEBUG', '/debug', 'Bug', 43),
    ('USUÁRIOS E PERMISSÕES', '/usuarios', 'Users', 44)
  ON CONFLICT (nome) DO NOTHING;
END $$;
