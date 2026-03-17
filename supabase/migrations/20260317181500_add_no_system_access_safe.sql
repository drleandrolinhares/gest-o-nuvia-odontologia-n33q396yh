-- Add no_system_access safely if it does not exist
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS no_system_access BOOLEAN DEFAULT false;
