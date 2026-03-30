DO $$
DECLARE
  v_user1_id uuid;
  v_user2_id uuid;
  v_admin_role_id uuid;
  v_master_role_id uuid;
BEGIN
  -- Ensure roles exist
  INSERT INTO public.roles (name, description) VALUES ('ADMIN', 'Administrador do Sistema') ON CONFLICT (name) DO NOTHING;
  INSERT INTO public.roles (name, description) VALUES ('MASTER', 'Acesso Master') ON CONFLICT (name) DO NOTHING;

  SELECT id INTO v_admin_role_id FROM public.roles WHERE name = 'ADMIN';
  SELECT id INTO v_master_role_id FROM public.roles WHERE name = 'MASTER';

  -- User 1: drleandrolinhares@gmail.com
  SELECT id INTO v_user1_id FROM auth.users WHERE email = 'drleandrolinhares@gmail.com';
  
  IF v_user1_id IS NULL THEN
    v_user1_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_user1_id,
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
    -- Force password reset just in case they lost access
    UPDATE auth.users 
    SET encrypted_password = crypt('securepassword123', gen_salt('bf'))
    WHERE id = v_user1_id;
  END IF;

  -- Ensure profile exists
  INSERT INTO public.profiles (id, email, nome)
  VALUES (v_user1_id, 'drleandrolinhares@gmail.com', 'Dr. Leandro Linhares')
  ON CONFLICT (id) DO UPDATE SET email = 'drleandrolinhares@gmail.com';

  -- Assign ADMIN role to this user
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (v_user1_id, v_admin_role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;

  -- User 2: master@nuvia.com.br
  SELECT id INTO v_user2_id FROM auth.users WHERE email = 'master@nuvia.com.br';
  
  IF v_user2_id IS NULL THEN
    v_user2_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_user2_id,
      '00000000-0000-0000-0000-000000000000',
      'master@nuvia.com.br',
      crypt('Master@2024Nuvia', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Master Nuvia"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', '', '', ''
    );
  ELSE
    -- Force password reset
    UPDATE auth.users 
    SET encrypted_password = crypt('Master@2024Nuvia', gen_salt('bf'))
    WHERE id = v_user2_id;
  END IF;

  -- Ensure profile exists
  INSERT INTO public.profiles (id, email, nome)
  VALUES (v_user2_id, 'master@nuvia.com.br', 'Master Nuvia')
  ON CONFLICT (id) DO UPDATE SET email = 'master@nuvia.com.br';

  -- Assign MASTER role to this user
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (v_user2_id, v_master_role_id)
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
