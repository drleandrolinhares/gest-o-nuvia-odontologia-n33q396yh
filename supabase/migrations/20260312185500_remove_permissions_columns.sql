-- Drop access_level column as we now have a globally unrestricted environment
ALTER TABLE public.acessos DROP COLUMN IF EXISTS access_level;
