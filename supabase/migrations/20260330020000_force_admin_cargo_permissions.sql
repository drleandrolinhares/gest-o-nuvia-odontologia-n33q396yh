DO $$
DECLARE
  v_user1_id uuid;
  v_user2_id uuid;
  v_cargo_ceo_id uuid;
BEGIN
  -- 1. Ensure CEO cargo exists
  INSERT INTO public.cargos (id, nome, descricao) 
  VALUES (gen_random_uuid(), 'CEO', 'Diretor / CEO')
  ON CONFLICT (nome) DO UPDATE SET nome = 'CEO'
  RETURNING id INTO v_cargo_ceo_id;

  IF v_cargo_ceo_id IS NULL THEN
    SELECT id INTO v_cargo_ceo_id FROM public.cargos WHERE nome = 'CEO';
  END IF;

  -- 2. Ensure basic menus exist
  INSERT INTO public.menus_sistema (id, nome, rota, ordem)
  VALUES 
    (gen_random_uuid(), 'DASHBOARD', '/dashboard', 1),
    (gen_random_uuid(), 'CONFIGURAÇÕES', '/configuracoes', 99)
  ON CONFLICT (nome) DO NOTHING;

  -- 3. Ensure CEO has permission to EVERYTHING
  INSERT INTO public.permissoes_cargo (cargo_id, menu_id, pode_ver, pode_editar, pode_deletar, pode_criar)
  SELECT v_cargo_ceo_id, id, true, true, true, true FROM public.menus_sistema
  ON CONFLICT (cargo_id, menu_id) 
  DO UPDATE SET pode_ver = true, pode_editar = true, pode_deletar = true, pode_criar = true;

  -- 4. Apply to User 1 (drleandrolinhares@gmail.com)
  SELECT id INTO v_user1_id FROM auth.users WHERE email = 'drleandrolinhares@gmail.com';
  IF v_user1_id IS NOT NULL THEN
    DELETE FROM public.user_cargos WHERE user_id = v_user1_id;
    INSERT INTO public.user_cargos (id, user_id, cargo_id, cargo, is_principal)
    VALUES (gen_random_uuid(), v_user1_id, v_cargo_ceo_id, 'CEO', true);
    
    UPDATE public.profiles SET cargo_id = v_cargo_ceo_id WHERE id = v_user1_id;
  END IF;

  -- 5. Apply to User 2 (master@nuvia.com.br)
  SELECT id INTO v_user2_id FROM auth.users WHERE email = 'master@nuvia.com.br';
  IF v_user2_id IS NOT NULL THEN
    DELETE FROM public.user_cargos WHERE user_id = v_user2_id;
    INSERT INTO public.user_cargos (id, user_id, cargo_id, cargo, is_principal)
    VALUES (gen_random_uuid(), v_user2_id, v_cargo_ceo_id, 'CEO', true);
    
    UPDATE public.profiles SET cargo_id = v_cargo_ceo_id WHERE id = v_user2_id;
  END IF;
END $$;
