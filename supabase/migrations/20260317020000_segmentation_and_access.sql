-- Add no_system_access to employees
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS no_system_access BOOLEAN NOT NULL DEFAULT false;

-- Create specialties table
CREATE TABLE IF NOT EXISTS public.specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    color_hex TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users on specialties" ON public.specialties FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create agenda_segmentation table
CREATE TABLE IF NOT EXISTS public.agenda_segmentation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultorio_id UUID NOT NULL REFERENCES public.clinica_consultorios(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 6),
    shift_type TEXT NOT NULL CHECK (shift_type IN ('MANHÃ', 'TARDE')),
    dentist_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    specialty_id UUID REFERENCES public.specialties(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(consultorio_id, day_of_week, shift_type)
);

ALTER TABLE public.agenda_segmentation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users on agenda_segmentation" ON public.agenda_segmentation FOR ALL TO authenticated USING (true) WITH CHECK (true);

