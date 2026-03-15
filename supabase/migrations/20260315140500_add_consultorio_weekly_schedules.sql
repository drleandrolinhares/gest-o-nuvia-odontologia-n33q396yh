CREATE TABLE IF NOT EXISTS public.consultorio_weekly_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultorio_id UUID NOT NULL REFERENCES public.clinica_consultorios(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 6),
    morning_start TIME,
    morning_end TIME,
    afternoon_start TIME,
    afternoon_end TIME,
    is_closed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(consultorio_id, day_of_week)
);

ALTER TABLE public.consultorio_weekly_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users on consultorio_weekly_schedules"
    ON public.consultorio_weekly_schedules
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

