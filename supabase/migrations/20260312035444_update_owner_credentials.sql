DO $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'drleandrolinhares@gmail.com';

  IF target_user_id IS NULL THEN
    target_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      target_user_id,
      '00000000-0000-0000-0000-000000000000',
      'drleandrolinhares@gmail.com',
      crypt('CRYPTEKS10@', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Leandro de Souza"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );
  ELSE
    UPDATE auth.users 
    SET encrypted_password = crypt('CRYPTEKS10@', gen_salt('bf')),
        raw_user_meta_data = '{"name": "Leandro de Souza"}'
    WHERE id = target_user_id;
  END IF;

  -- Update or insert into public.profiles
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = target_user_id) THEN
    UPDATE public.profiles
    SET name = 'Leandro de Souza', email = 'drleandrolinhares@gmail.com'
    WHERE id = target_user_id;
  ELSE
    INSERT INTO public.profiles (id, email, name)
    VALUES (target_user_id, 'drleandrolinhares@gmail.com', 'Leandro de Souza');
  END IF;

  -- Update or insert into public.employees
  IF EXISTS (SELECT 1 FROM public.employees WHERE user_id = target_user_id) THEN
    UPDATE public.employees
    SET name = 'Leandro de Souza',
        team_category = 'MASTER',
        access_level = 'MASTER',
        role = 'Sócio Proprietário',
        department = 'Diretoria',
        permissions = '["dashboard", "admin", "permissions", "agenda", "acessos", "rh", "estoque", "configuracoes", "auditoria"]'::jsonb,
        system_profiles = '["admin"]'::jsonb
    WHERE user_id = target_user_id;
  ELSE
    INSERT INTO public.employees (
      user_id, name, email, department, role, team_category, access_level, status,
      hire_date, vacation_days_taken, vacation_days_total, created_at, last_access,
      permissions, system_profiles
    ) VALUES (
      target_user_id,
      'Leandro de Souza',
      'drleandrolinhares@gmail.com',
      'Diretoria',
      'Sócio Proprietário',
      'MASTER',
      'MASTER',
      'Ativo',
      NOW(),
      0,
      30,
      NOW(),
      NOW(),
      '["dashboard", "admin", "permissions", "agenda", "acessos", "rh", "estoque", "configuracoes", "auditoria"]'::jsonb,
      '["admin"]'::jsonb
    );
  END IF;

END $$;
