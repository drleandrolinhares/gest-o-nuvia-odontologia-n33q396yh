ALTER TABLE public.employees
ADD COLUMN IF NOT EXISTS username text,
ADD COLUMN IF NOT EXISTS rg text,
ADD COLUMN IF NOT EXISTS cpf text,
ADD COLUMN IF NOT EXISTS birth_date text,
ADD COLUMN IF NOT EXISTS cep text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS address_number text,
ADD COLUMN IF NOT EXISTS address_complement text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS access_schedule boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS system_profiles jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS last_access timestamp with time zone;
