ALTER TABLE public.employees
ADD COLUMN IF NOT EXISTS team_category text DEFAULT 'COLABORADOR'::text,
ADD COLUMN IF NOT EXISTS contract_details text DEFAULT ''::text;
