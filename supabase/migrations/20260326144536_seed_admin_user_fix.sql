DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Garante que a role Administrador existe
  INSERT INTO public.roles (name) VALUES ('Administrador') ON CONFLICT (name) DO NOTHING;

  -- Se o usuário não existe, criamos a conta do admin no auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'drleandrolinhares@gmail.com') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'drleandrolinhares@gmail.com',
      crypt('Vlab2026@@', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Dr. Leandro Linhares"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    -- Insere o profile vinculado ao usuário
    INSERT INTO public.profiles (id, email, name)
    VALUES (new_user_id, 'drleandrolinhares@gmail.com', 'Dr. Leandro Linhares')
    ON CONFLICT (id) DO NOTHING;

  ELSE
    -- Se já existe, apenas atualiza a senha para a informada
    UPDATE auth.users
    SET encrypted_password = crypt('Vlab2026@@', gen_salt('bf'))
    WHERE email = 'drleandrolinhares@gmail.com'
    RETURNING id INTO new_user_id;
  END IF;

  -- Garante que exista e esteja vinculado um perfil na tabela employees
  IF EXISTS (SELECT 1 FROM public.employees WHERE email = 'drleandrolinhares@gmail.com') THEN
    UPDATE public.employees
    SET user_id = new_user_id,
        team_category = ARRAY['ADMIN', 'MASTER', 'DIRETORIA']
    WHERE email = 'drleandrolinhares@gmail.com';
  ELSE
    INSERT INTO public.employees (id, user_id, name, role, department, email, team_category)
    VALUES (gen_random_uuid(), new_user_id, 'Dr. Leandro Linhares', 'Administrador', 'DIRETORIA', 'drleandrolinhares@gmail.com', ARRAY['ADMIN', 'MASTER', 'DIRETORIA']);
  END IF;
END $$;
