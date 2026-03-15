ALTER TABLE public.employees
ADD COLUMN IF NOT EXISTS pix_key text,
ADD COLUMN IF NOT EXISTS pix_type text,
ADD COLUMN IF NOT EXISTS bank_name text;
