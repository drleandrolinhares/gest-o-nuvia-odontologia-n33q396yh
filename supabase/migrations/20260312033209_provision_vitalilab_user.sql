DO $$
DECLARE
  target_user_id uuid;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'vitalilab3d@gmail.com';

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
      'vitalilab3d@gmail.com',
      crypt('Lab3D@26', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      '{"name": "Vitali Lab 3D"}'::jsonb,
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );
  ELSE
    UPDATE auth.users 
    SET encrypted_password = crypt('Lab3D@26', gen_salt('bf')),
        raw_user_meta_data = '{"name": "Vitali Lab 3D"}'::jsonb,
        email_confirmed_at = COALESCE(email_confirmed_at, NOW())
    WHERE id = target_user_id;
  END IF;

  -- Ensure a corresponding entry is created in the public.profiles table
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = target_user_id) THEN
    INSERT INTO public.profiles (id, email, name)
    VALUES (target_user_id, 'vitalilab3d@gmail.com', 'Vitali Lab 3D');
  ELSE
    UPDATE public.profiles
    SET name = 'Vitali Lab 3D'
    WHERE id = target_user_id;
  END IF;
END $$;
