DO $$
DECLARE
  v_admin_id UUID;
  v_menu RECORD;
BEGIN
  -- Ensure roles exist
  INSERT INTO public.cargos (nome, descricao) VALUES
    ('ADMINISTRADOR', 'Acesso total ao sistema'),
    ('DENTISTA', 'Profissional de odontologia'),
    ('RECEPCIONISTA', 'Atendimento ao cliente e agendamentos'),
    ('GERENTE', 'Gestão operacional e administrativa'),
    ('AUXILIAR', 'Suporte geral e operacional'),
    ('ASB', 'Auxiliar em Saúde Bucal')
  ON CONFLICT (nome) DO NOTHING;

  -- Create temp table to hold our expected menus
  CREATE TEMP TABLE temp_menus (
    nome TEXT,
    rota TEXT,
    icone TEXT,
    ordem INT
  );

  INSERT INTO temp_menus VALUES
    ('OPERACIONAL', NULL, 'Activity', 10),
    ('SAC', '/sac', 'HeadphonesIcon', 11),
    ('ROTINA DIÁRIA', '/rotina-diaria', 'CalendarDays', 12),
    ('MENSAGENS', '/mensagens', 'MessageCircle', 13),
    ('PERFORMANCE', '/performance', 'Target', 14),
    ('COMUNICADOS', '/comunicados', 'Megaphone', 15),
    ('AVISOS E RECADOS', '/avisos-e-recados', 'Bell', 16),

    ('COMERCIAL', NULL, 'Handshake', 20),
    ('NEGOCIAÇÃO', '/negociacao', 'Handshake', 21),
    ('GESTÃO FISCAL', '/gestao-fiscal', 'DollarSign', 22),

    ('FINANCEIRO', NULL, 'DollarSign', 30),
    ('CENTRAL DE ACESSOS', '/central-de-acessos', 'Key', 31),
    ('ESTOQUE', '/estoque', 'Package', 32),

    ('ADMINISTRATIVO', NULL, 'Briefcase', 40),
    ('DASHBOARD', '/dashboard', 'LayoutDashboard', 41),
    ('KPIS', '/kpis', 'TrendingUp', 42),
    ('USUÁRIOS', '/usuarios', 'Users', 43),
    ('ESCALA DE TRABALHO', '/escala-de-trabalho', 'CalendarDays', 44),
    ('PRECIFICAÇÃO', '/precificacao', 'DollarSign', 45),
    ('SEGMENTAÇÃO DA AGENDA', '/segmentacao-agenda', 'Grid', 46),

    ('SISTEMA', NULL, 'Settings', 50),
    ('CONFIGURAÇÕES', '/configuracoes', 'Settings', 51),
    ('PERMISSÕES', '/permissoes', 'Shield', 52),
    ('LOGS', '/logs', 'ScrollText', 53),
    ('DEBUG', '/debug', 'Bug', 54);

  -- Upsert menus
  INSERT INTO public.menus_sistema (nome, rota, icone, ordem)
  SELECT nome, rota, icone, ordem FROM temp_menus
  ON CONFLICT (nome) DO UPDATE SET
    rota = EXCLUDED.rota,
    icone = EXCLUDED.icone,
    ordem = EXCLUDED.ordem;

  -- Assign all permissions to ADMINISTRADOR
  SELECT id INTO v_admin_id FROM public.cargos WHERE nome = 'ADMINISTRADOR';

  IF v_admin_id IS NOT NULL THEN
    FOR v_menu IN SELECT id FROM public.menus_sistema LOOP
      INSERT INTO public.permissoes_cargo (cargo_id, menu_id, pode_ver, pode_editar, pode_deletar)
      VALUES (v_admin_id, v_menu.id, true, true, true)
      ON CONFLICT (cargo_id, menu_id) DO UPDATE SET
        pode_ver = true,
        pode_editar = true,
        pode_deletar = true;
    END LOOP;
  END IF;

  DROP TABLE temp_menus;
END $$;
