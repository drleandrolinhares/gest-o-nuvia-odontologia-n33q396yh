CREATE TABLE IF NOT EXISTS public.clinical_specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.clinical_specialties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users on clinical_specialties"
    ON public.clinical_specialties FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS is_active_in_system BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.consultorio_weekly_schedules ADD COLUMN IF NOT EXISTS morning_dentist_id UUID REFERENCES public.employees(id) ON DELETE SET NULL;
ALTER TABLE public.consultorio_weekly_schedules ADD COLUMN IF NOT EXISTS morning_specialty_id UUID REFERENCES public.clinical_specialties(id) ON DELETE SET NULL;
ALTER TABLE public.consultorio_weekly_schedules ADD COLUMN IF NOT EXISTS afternoon_dentist_id UUID REFERENCES public.employees(id) ON DELETE SET NULL;
ALTER TABLE public.consultorio_weekly_schedules ADD COLUMN IF NOT EXISTS afternoon_specialty_id UUID REFERENCES public.clinical_specialties(id) ON DELETE SET NULL;

