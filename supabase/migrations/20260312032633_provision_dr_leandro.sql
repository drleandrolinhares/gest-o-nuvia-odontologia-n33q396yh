DO $$
DECLARE
  target_user_id uuid;
BEGIN
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
      crypt('crypteks10@', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Dr. Leandro Linhares"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    INSERT INTO public.employees (user_id, name, role, department, access_level, permissions)
    VALUES (
      target_user_id, 
      'DR. LEANDRO LINHARES', 
      'Administrador', 
      'Diretoria', 
      'ADMINISTRATIVO', 
      '["dashboard", "agenda", "acessos", "rh", "estoque", "configuracoes", "auditoria"]'::jsonb
    );
  ELSE
    UPDATE auth.users 
    SET encrypted_password = crypt('crypteks10@', gen_salt('bf')),
        raw_user_meta_data = '{"name": "Dr. Leandro Linhares"}'
    WHERE id = target_user_id;
    
    IF NOT EXISTS (SELECT 1 FROM public.employees WHERE user_id = target_user_id) THEN
      INSERT INTO public.employees (user_id, name, role, department, access_level, permissions)
      VALUES (
        target_user_id, 
        'DR. LEANDRO LINHARES', 
        'Administrador', 
        'Diretoria', 
        'ADMINISTRATIVO', 
        '["dashboard", "agenda", "acessos", "rh", "estoque", "configuracoes", "auditoria"]'::jsonb
      );
    END IF;
  END IF;
END $$;
