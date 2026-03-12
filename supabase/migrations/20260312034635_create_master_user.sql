DO $$
DECLARE
  master_user_id uuid := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'leandro.master@nuvia.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      master_user_id,
      '00000000-0000-0000-0000-000000000000',
      'leandro.master@nuvia.com',
      crypt('NuviaMaster2024!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Leandro de Souza"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    UPDATE public.profiles
    SET name = 'Leandro de Souza'
    WHERE id = master_user_id;

    INSERT INTO public.employees (
      id, user_id, name, email, department, role, team_category, access_level, status,
      hire_date, vacation_days_taken, vacation_days_total, created_at, last_access
    ) VALUES (
      gen_random_uuid(),
      master_user_id,
      'Leandro de Souza',
      'leandro.master@nuvia.com',
      'Administrativo',
      'Sócio Proprietário',
      'SÓCIO',
      'MASTER',
      'Ativo',
      NOW(),
      0,
      30,
      NOW(),
      NOW()
    );
  END IF;
END $$;
