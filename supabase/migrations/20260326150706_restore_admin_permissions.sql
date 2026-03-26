DO $$
DECLARE
    v_user_id UUID;
    v_role TEXT;
    v_mod TEXT;
    v_modules TEXT[] := ARRAY[
      'DASHBOARD', 'AGENDA', 'MENSAGENS', 'RH', 'ESCALA DE TRABALHO', 'ESTOQUE', 
      'PRECIFICAÇÃO', 'ACESSOS', 'LOGS', 'CONFIGURAÇÕES', 'SAC', 'ROTINA DIÁRIA', 
      'PERFORMANCE', 'COMUNICADOS', 'NEGOCIAÇÃO', 'GESTÃO FISCAL', 'KPIS', 'SEGMENTAÇÃO',
      'dashboards', 'agenda', 'mensagens', 'usuarios-rh', 'escala-trabalho', 'estoque', 
      'precificacao', 'central-acessos', 'logs', 'configuracoes', 'sac', 'rotina-diaria', 
      'performance', 'comunicados', 'negociacao', 'gestao-fiscal', 'kpis', 'segmentacao-agenda'
    ];
BEGIN
    -- Obter o ID do usuário Leandro
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'drleandrolinhares@gmail.com' LIMIT 1;
    
    IF v_user_id IS NOT NULL THEN
        -- Garantir que o perfil e employee existam (ou atualizar se necessário)
        SELECT role INTO v_role FROM public.employees WHERE user_id = v_user_id LIMIT 1;
        
        -- Conceder permissões de usuário em todos os módulos
        FOREACH v_mod IN ARRAY v_modules
        LOOP
            INSERT INTO public.user_permissions (user_id, module, can_view, can_create, can_edit, can_delete, updated_at)
            VALUES (v_user_id, v_mod, true, true, true, true, NOW())
            ON CONFLICT (user_id, module) DO UPDATE SET
                can_view = true,
                can_create = true,
                can_edit = true,
                can_delete = true,
                updated_at = NOW();
        END LOOP;

        -- Conceder permissões de role se ele tiver um role associado
        IF v_role IS NOT NULL THEN
            FOREACH v_mod IN ARRAY v_modules
            LOOP
                INSERT INTO public.role_permissions (role, module, can_view, can_create, can_edit, can_delete, updated_at)
                VALUES (v_role, v_mod, true, true, true, true, NOW())
                ON CONFLICT (role, module) DO UPDATE SET
                    can_view = true,
                    can_create = true,
                    can_edit = true,
                    can_delete = true,
                    updated_at = NOW();
            END LOOP;
        END IF;
    END IF;
END $$;
