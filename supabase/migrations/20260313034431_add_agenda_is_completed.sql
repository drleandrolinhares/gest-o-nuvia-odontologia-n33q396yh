ALTER TABLE public.agenda
ADD COLUMN IF NOT EXISTS is_completed boolean DEFAULT false;
