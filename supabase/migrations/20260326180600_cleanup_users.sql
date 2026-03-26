DO $$ 
DECLARE
  v_admin_role_id uuid;
  v_leandro_id uuid;
BEGIN
  -- 1. Remover dependências de user_roles para usuários que serão deletados
  DELETE FROM public.user_roles 
  WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email NOT ILIKE '%leandro%' AND email NOT ILIKE '%souza%'
  );

  -- 2. Remover dependências de user_permissions (se a tabela ainda existir como precaução)
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_permissions') THEN
    EXECUTE 'DELETE FROM public.user_permissions WHERE user_id IN (SELECT id FROM auth.users WHERE email NOT ILIKE ''%leandro%'' AND email NOT ILIKE ''%souza%'')';
  END IF;

  -- 3. Deletar os usuários da tabela auth.users (exceto leandro/souza)
  DELETE FROM auth.users 
  WHERE email NOT ILIKE '%leandro%' AND email NOT ILIKE '%souza%';

  -- 4. Garantir que a role 'ADMIN' exista na nova estrutura
  SELECT id INTO v_admin_role_id FROM public.roles WHERE name = 'ADMIN';
  IF v_admin_role_id IS NULL THEN
    INSERT INTO public.roles (name, description) VALUES ('ADMIN', 'Administrador do Sistema') RETURNING id INTO v_admin_role_id;
  END IF;

  -- 5. Associar automaticamente os usuários restantes (leandro/souza) à role 'ADMIN' para validação
  FOR v_leandro_id IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%' OR email ILIKE '%souza%') LOOP
    INSERT INTO public.user_roles (user_id, role_id) 
    VALUES (v_leandro_id, v_admin_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END LOOP;

END $$;
