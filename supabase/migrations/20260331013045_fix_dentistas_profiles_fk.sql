-- Adiciona a chave estrangeira entre dentistas_avaliadores.usuario_id e profiles.id
-- Isso permite o uso de joins via API como dentistas_avaliadores(..., profiles!inner(nome)) resolvendo o erro PGRST200
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'dentistas_avaliadores_usuario_id_profiles_fkey'
  ) THEN
    ALTER TABLE public.dentistas_avaliadores 
      ADD CONSTRAINT dentistas_avaliadores_usuario_id_profiles_fkey 
      FOREIGN KEY (usuario_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;
