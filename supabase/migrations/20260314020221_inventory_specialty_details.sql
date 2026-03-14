ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS specialty_details JSONB DEFAULT '{}'::jsonb;

