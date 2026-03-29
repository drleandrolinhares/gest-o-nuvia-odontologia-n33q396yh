-- Resolve o erro PGRST200 restaurando a relação estrutural entre profiles e cargos
-- Isso permite que queries como .select('..., cargos(nome)') funcionem sem falhas no frontend.

DO $$
BEGIN
  -- Adiciona a coluna se não existir
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN cargo_id UUID;
  EXCEPTION WHEN duplicate_column THEN
  END;

  -- Adiciona a foreign key se não existir
  BEGIN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_cargo_id_fkey FOREIGN KEY (cargo_id) REFERENCES public.cargos(id) ON DELETE SET NULL;
  EXCEPTION WHEN duplicate_object THEN
  END;
END $$;

-- Sincroniza dados existentes de user_cargos para profiles
DO $$
BEGIN
  UPDATE public.profiles p
  SET cargo_id = uc.cargo_id
  FROM public.user_cargos uc
  WHERE uc.user_id = p.id AND uc.is_principal = true AND (p.cargo_id IS NULL OR p.cargo_id != uc.cargo_id);
END $$;

-- Função e Trigger para manter a integridade atômica
CREATE OR REPLACE FUNCTION public.sync_user_cargos_to_profiles()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.is_principal = true THEN
      UPDATE public.profiles SET cargo_id = NEW.cargo_id WHERE id = NEW.user_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.is_principal = true THEN
      UPDATE public.profiles SET cargo_id = NULL WHERE id = OLD.user_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_user_cargos_to_profiles ON public.user_cargos;
CREATE TRIGGER trg_sync_user_cargos_to_profiles
AFTER INSERT OR UPDATE OR DELETE ON public.user_cargos
FOR EACH ROW EXECUTE FUNCTION public.sync_user_cargos_to_profiles();

-- Notifica o PostgREST para recarregar o schema imediatamente, aplicando a correção em tempo real
NOTIFY pgrst, 'reload schema';
