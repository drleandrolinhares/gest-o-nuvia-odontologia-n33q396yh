DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- We want to make sure drleandrolinhares@gmail.com exists and can login.
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'drleandrolinhares@gmail.com';
  
  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'drleandrolinhares@gmail.com',
      crypt('securepassword123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Dr. Leandro Linhares"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', '', '', ''
    );
  ELSE
    -- Force password reset to securepassword123 just in case they lost access
    UPDATE auth.users 
    SET encrypted_password = crypt('securepassword123', gen_salt('bf'))
    WHERE id = v_user_id;
  END IF;

  -- Ensure profile exists
  INSERT INTO public.profiles (id, email, nome)
  VALUES (v_user_id, 'drleandrolinhares@gmail.com', 'Dr. Leandro Linhares')
  ON CONFLICT (id) DO UPDATE SET email = 'drleandrolinhares@gmail.com';

  -- Ensure role ADMIN exists
  INSERT INTO public.roles (name, description) VALUES ('ADMIN', 'Administrador do Sistema') ON CONFLICT (name) DO NOTHING;

  -- Assign ADMIN role to this user
  INSERT INTO public.user_roles (user_id, role_id)
  SELECT v_user_id, id FROM public.roles WHERE name = 'ADMIN'
  ON CONFLICT (user_id, role_id) DO NOTHING;

  -- Fix auth users tokens (null to empty string)
  UPDATE auth.users
  SET
    confirmation_token = COALESCE(confirmation_token, ''),
    recovery_token = COALESCE(recovery_token, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    email_change = COALESCE(email_change, ''),
    email_change_token_current = COALESCE(email_change_token_current, ''),
    phone_change = COALESCE(phone_change, ''),
    phone_change_token = COALESCE(phone_change_token, ''),
    reauthentication_token = COALESCE(reauthentication_token, '')
  WHERE
    confirmation_token IS NULL OR recovery_token IS NULL
    OR email_change_token_new IS NULL OR email_change IS NULL
    OR email_change_token_current IS NULL
    OR phone_change IS NULL OR phone_change_token IS NULL
    OR reauthentication_token IS NULL;

END $$;
