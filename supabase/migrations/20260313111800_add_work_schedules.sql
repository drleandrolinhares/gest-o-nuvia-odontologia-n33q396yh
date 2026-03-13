CREATE TABLE IF NOT EXISTS public.work_schedules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    work_date date NOT NULL,
    start_time time,
    end_time time,
    morning_snack_start time,
    morning_snack_end time,
    afternoon_snack_start time,
    afternoon_snack_end time,
    total_daily_hours numeric DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(employee_id, work_date)
);

ALTER TABLE public.work_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users" ON public.work_schedules
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
