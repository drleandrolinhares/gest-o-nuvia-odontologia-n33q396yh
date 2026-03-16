ALTER TABLE public.sac_records ALTER COLUMN action_history SET DEFAULT '[]'::jsonb;
UPDATE public.sac_records SET action_history = '[]'::jsonb WHERE action_history IS NULL;
