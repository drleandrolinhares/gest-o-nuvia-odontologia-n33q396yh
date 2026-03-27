DO $$ 
BEGIN
  -- Garantir que a tabela permissoes_cargo tenha a constraint unica correta
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'permissoes_cargo_cargo_menu_key') THEN
    ALTER TABLE public.permissoes_cargo DROP CONSTRAINT permissoes_cargo_cargo_menu_key;
  END IF;
  DROP INDEX IF EXISTS permissoes_cargo_cargo_menu_key;
  ALTER TABLE public.permissoes_cargo ADD CONSTRAINT permissoes_cargo_cargo_menu_key UNIQUE (cargo_id, menu_id);

  -- Garantir que a tabela permissoes_usuario tenha a constraint unica correta
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'permissoes_usuario_user_menu_key') THEN
    ALTER TABLE public.permissoes_usuario DROP CONSTRAINT permissoes_usuario_user_menu_key;
  END IF;
  DROP INDEX IF EXISTS permissoes_usuario_user_menu_key;
  ALTER TABLE public.permissoes_usuario ADD CONSTRAINT permissoes_usuario_user_menu_key UNIQUE (user_id, menu_id);
END $$;
