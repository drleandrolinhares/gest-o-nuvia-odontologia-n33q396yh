-- Remove access_level from profiles and employees if they exist
ALTER TABLE public.profiles DROP COLUMN IF EXISTS access_level;
ALTER TABLE public.employees DROP COLUMN IF EXISTS access_level;

-- Ensure RLS is enabled but allows all authenticated users to read and write without restrictions
DO $$ 
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Allow all authenticated users" ON public.%I;', t);
    EXECUTE format('CREATE POLICY "Allow all authenticated users" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true);', t);
  END LOOP;
END $$;
