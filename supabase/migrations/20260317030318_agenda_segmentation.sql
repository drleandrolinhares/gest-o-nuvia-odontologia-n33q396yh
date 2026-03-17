ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS no_system_access BOOLEAN DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS public.agenda_specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.agenda_segmentation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultorio_id UUID REFERENCES public.clinica_consultorios(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 6),
    shift TEXT NOT NULL CHECK (shift IN ('MANHÃ', 'TARDE')),
    specialty_id UUID REFERENCES public.agenda_specialties(id) ON DELETE SET NULL,
    dentist_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(consultorio_id, day_of_week, shift)
);

ALTER TABLE public.agenda_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_segmentation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_select_agenda_specialties" ON public.agenda_specialties FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_agenda_specialties" ON public.agenda_specialties FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_agenda_specialties" ON public.agenda_specialties FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_delete_agenda_specialties" ON public.agenda_specialties FOR DELETE TO authenticated USING (true);

CREATE POLICY "authenticated_select_agenda_segmentation" ON public.agenda_segmentation FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_agenda_segmentation" ON public.agenda_segmentation FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_agenda_segmentation" ON public.agenda_segmentation FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_delete_agenda_segmentation" ON public.agenda_segmentation FOR DELETE TO authenticated USING (true);

