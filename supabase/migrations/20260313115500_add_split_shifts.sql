ALTER TABLE public.work_schedules 
ADD COLUMN IF NOT EXISTS morning_end_time time without time zone,
ADD COLUMN IF NOT EXISTS afternoon_start_time time without time zone;
