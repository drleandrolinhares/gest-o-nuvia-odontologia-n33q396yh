DO $BODY$
DECLARE
  v_master_user_id uuid;
  v_ceo_id uuid;
  v_role_id uuid;
  v_cargo_admin_id uuid;
  v_menu RECORD;
BEGIN
  -- 1. Remover o usuário fictício 'master@nuvia.com.br' da tabela de autenticação
  SELECT id INTO v_master_user_id FROM auth.users WHERE email = 'master@nuvia.com.br';
  IF v_master_user_id IS NOT NULL THEN
    DELETE FROM auth.users WHERE id = v_master_user_id;
  END IF;

  -- 2. Promover 'drleandrolinhares@gmail.com' a MASTER
  SELECT id INTO v_ceo_id FROM auth.users WHERE email = 'drleandrolinhares@gmail.com';
  
  IF v_ceo_id IS NOT NULL THEN
    -- Atualizar metadados na tabela auth.users
    UPDATE auth.users 
    SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "MASTER", "is_admin": true}'::jsonb
    WHERE id = v_ceo_id;

    -- Garantir que a role 'MASTER' exista na tabela roles
    INSERT INTO public.roles (name, description) 
    VALUES ('MASTER', 'Acesso irrestrito')
    ON CONFLICT (name) DO NOTHING;
    
    SELECT id INTO v_role_id FROM public.roles WHERE name = 'MASTER';

    IF v_role_id IS NOT NULL THEN
      -- Vincular CEO à role 'MASTER'
      INSERT INTO public.user_roles (user_id, role_id)
      VALUES (v_ceo_id, v_role_id)
      ON CONFLICT (user_id, role_id) DO NOTHING;
    END IF;
    
    -- Garantir que o cargo 'ADMINISTRADOR' exista
    INSERT INTO public.cargos (nome, descricao)
    VALUES ('ADMINISTRADOR', 'Acesso total ao sistema')
    ON CONFLICT (nome) DO NOTHING;

    SELECT id INTO v_cargo_admin_id FROM public.cargos WHERE nome = 'ADMINISTRADOR';

    IF v_cargo_admin_id IS NOT NULL THEN
      -- Atualizar o perfil do CEO para ter o cargo de ADMINISTRADOR
      UPDATE public.profiles 
      SET cargo_id = v_cargo_admin_id
      WHERE id = v_ceo_id;
    END IF;

    -- 3. Atualizar a tabela de permissões para garantir acesso TOTAL a todos os menus
    FOR v_menu IN SELECT id FROM public.menus_sistema LOOP
      INSERT INTO public.permissoes_usuario (user_id, menu_id, pode_ver, pode_editar, pode_deletar)
      VALUES (v_ceo_id, v_menu.id, true, true, true)
      ON CONFLICT (user_id, menu_id) DO UPDATE SET
        pode_ver = true,
        pode_editar = true,
        pode_deletar = true;
    END LOOP;
  END IF;
END $BODY$;
