DO $$
DECLARE
  v_cargo_id UUID;
  v_user_id UUID;
BEGIN
  -- Garantir que o cargo ADMINISTRADOR exista
  IF NOT EXISTS (SELECT 1 FROM public.cargos WHERE nome = 'ADMINISTRADOR') THEN
    INSERT INTO public.cargos (nome, descricao) VALUES ('ADMINISTRADOR', 'Acesso total ao sistema');
  END IF;

  -- Buscar o ID do cargo ADMINISTRADOR
  SELECT id INTO v_cargo_id FROM public.cargos WHERE nome = 'ADMINISTRADOR' LIMIT 1;
  
  -- Buscar o usuário SAMUEL CANTÃO
  SELECT id INTO v_user_id FROM public.profiles WHERE nome ILIKE '%SAMUEL CANTÃO%' LIMIT 1;
  
  -- Se o usuário existir e o cargo existir, atualizar o perfil para garantir o acesso ao DASHBOARD
  IF v_user_id IS NOT NULL AND v_cargo_id IS NOT NULL THEN
    UPDATE public.profiles SET cargo_id = v_cargo_id WHERE id = v_user_id;
  END IF;
END $$;
