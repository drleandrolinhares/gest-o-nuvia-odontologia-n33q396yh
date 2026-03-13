DO $$ 
BEGIN
  -- Rename start_time to morning_start
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='work_schedules' AND column_name='start_time') THEN
    ALTER TABLE public.work_schedules RENAME COLUMN start_time TO morning_start;
  END IF;

  -- Rename end_time to afternoon_end
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='work_schedules' AND column_name='end_time') THEN
    ALTER TABLE public.work_schedules RENAME COLUMN end_time TO afternoon_end;
  END IF;

  -- Ensure morning_end exists (rename if old name exists)
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='work_schedules' AND column_name='morning_end_time') THEN
    ALTER TABLE public.work_schedules RENAME COLUMN morning_end_time TO morning_end;
  ELSIF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='work_schedules' AND column_name='morning_end') THEN
    ALTER TABLE public.work_schedules ADD COLUMN morning_end time without time zone;
  END IF;

  -- Ensure afternoon_start exists (rename if old name exists)
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='work_schedules' AND column_name='afternoon_start_time') THEN
    ALTER TABLE public.work_schedules RENAME COLUMN afternoon_start_time TO afternoon_start;
  ELSIF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='work_schedules' AND column_name='afternoon_start') THEN
    ALTER TABLE public.work_schedules ADD COLUMN afternoon_start time without time zone;
  END IF;

END $$;
