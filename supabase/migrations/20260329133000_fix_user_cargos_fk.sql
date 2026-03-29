DO $$ 
BEGIN
  -- Remove registros órfãos que possam existir em user_cargos sem correspondência na tabela profiles
  DELETE FROM public.user_cargos WHERE user_id NOT IN (SELECT id FROM public.profiles);

  -- Remove a chave estrangeira existente que apontava diretamente para auth.users
  ALTER TABLE public.user_cargos DROP CONSTRAINT IF EXISTS user_cargos_user_id_fkey;

  -- Adiciona a nova chave estrangeira apontando para profiles
  -- Isso permite que o Supabase/PostgREST infira automaticamente o relacionamento
  -- para queries do tipo: supabase.from('profiles').select('*, user_cargos(*)')
  ALTER TABLE public.user_cargos
    ADD CONSTRAINT user_cargos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
END $$;
