DO $$ 
DECLARE
  v_new_user_id UUID := gen_random_uuid();
  v_admin_role_id UUID;
BEGIN
  -- 1. Deletar referências do usuário leandro nas tabelas dependentes
  DELETE FROM public.user_roles WHERE user_id IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%');
  DELETE FROM public.employees WHERE email ILIKE '%leandro%' OR user_id IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%');
  
  DELETE FROM public.chat_participants WHERE user_id IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%');
  DELETE FROM public.chat_messages WHERE sender_id IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%');
  DELETE FROM public.hub_announcement_reads WHERE user_id IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%');
  DELETE FROM public.hub_feedbacks WHERE user_id IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%');
  DELETE FROM public.innovation_records WHERE user_id IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%');
  DELETE FROM public.monthly_readings WHERE user_id IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%');
  DELETE FROM public.ser_5s_submissions WHERE user_id IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%');
  
  -- 2. Deletar usuário leandro da tabela auth.users
  DELETE FROM auth.users WHERE email ILIKE '%leandro%';

  -- 3. Criar o novo usuário Master (Email: master@nuvia.com.br | Senha: Master@2024Nuvia)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'master@nuvia.com.br') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'master@nuvia.com.br',
      crypt('Master@2024Nuvia', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Master Nuvia"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    -- 4. Garantir que a Role 'ADMIN' existe
    SELECT id INTO v_admin_role_id FROM public.roles WHERE name = 'ADMIN';
    IF v_admin_role_id IS NULL THEN
      INSERT INTO public.roles (id, name, description) 
      VALUES (gen_random_uuid(), 'ADMIN', 'Administrador do Sistema') 
      RETURNING id INTO v_admin_role_id;
    END IF;

    -- 5. Associar a Role 'ADMIN' ao novo usuário master
    INSERT INTO public.user_roles (user_id, role_id) 
    VALUES (v_new_user_id, v_admin_role_id) 
    ON CONFLICT DO NOTHING;

    -- 6. Criar perfil de Colaborador (Employee) para o master ter acesso integral ao dashboard
    INSERT INTO public.employees (
      id, user_id, name, email, role, department, team_category, status
    ) VALUES (
      gen_random_uuid(), 
      v_new_user_id, 
      'Master Nuvia', 
      'master@nuvia.com.br', 
      'Administrador Geral', 
      'Diretoria', 
      ARRAY['ADMIN', 'MASTER', 'DIRETORIA'], 
      'Ativo'
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;
