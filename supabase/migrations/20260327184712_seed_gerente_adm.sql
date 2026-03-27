DO $$
DECLARE
  v_cargo_id uuid;
  v_user_id uuid;
  v_menu record;
BEGIN
  -- 1. Ensure Cargo exists
  SELECT id INTO v_cargo_id FROM public.cargos WHERE nome = 'GERENTE ADM';
  IF v_cargo_id IS NULL THEN
    v_cargo_id := gen_random_uuid();
    INSERT INTO public.cargos (id, nome, descricao) VALUES (v_cargo_id, 'GERENTE ADM', 'Gerente Administrativo (Test)');
  END IF;

  -- 2. Give permissions to cargo for all menus
  FOR v_menu IN SELECT id FROM public.menus_sistema LOOP
    INSERT INTO public.permissoes_cargo (cargo_id, menu_id, pode_ver, pode_criar, pode_editar, pode_deletar)
    VALUES (v_cargo_id, v_menu.id, true, true, true, true)
    ON CONFLICT (cargo_id, menu_id) DO UPDATE SET 
      pode_ver = true, pode_criar = true, pode_editar = true, pode_deletar = true;
  END LOOP;

  -- 3. Create Test User
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'gerente@nuvia.com.br') THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'gerente@nuvia.com.br',
      crypt('gerente123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Gerente Teste"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.profiles (id, email, nome, cargo_id)
    VALUES (v_user_id, 'gerente@nuvia.com.br', 'Gerente Teste', v_cargo_id)
    ON CONFLICT (id) DO NOTHING;

    -- Inherit permissions
    FOR v_menu IN SELECT id FROM public.menus_sistema LOOP
      INSERT INTO public.permissoes_usuario (user_id, menu_id, pode_ver, pode_criar, pode_editar, pode_deletar)
      VALUES (v_user_id, v_menu.id, true, true, true, true)
      ON CONFLICT (user_id, menu_id) DO NOTHING;
    END LOOP;
  END IF;

END $$;
