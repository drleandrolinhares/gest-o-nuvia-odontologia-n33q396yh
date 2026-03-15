ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS pix_number text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS pix_type text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS bank_name text;

-- Migrate data if pix_key was previously used to prevent data loss
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='employees' AND column_name='pix_key') THEN
        UPDATE public.employees SET pix_number = pix_key WHERE pix_number IS NULL AND pix_key IS NOT NULL;
    END IF;
END $$;
