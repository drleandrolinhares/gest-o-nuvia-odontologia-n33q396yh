ALTER TABLE public.sac_records ADD COLUMN IF NOT EXISTS action_history JSONB DEFAULT '[]'::jsonb;

