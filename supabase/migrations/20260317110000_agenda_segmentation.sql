CREATE TABLE IF NOT EXISTS public.specialty_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.agenda_segmentation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultorio_id UUID NOT NULL REFERENCES public.clinica_consultorios(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 6),
  shift TEXT NOT NULL CHECK (shift IN ('MANHÃ', 'TARDE')),
  specialty_id UUID REFERENCES public.specialty_configs(id) ON DELETE SET NULL,
  dentist_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(consultorio_id, day_of_week, shift)
);

ALTER TABLE public.specialty_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users on specialty_configs" ON public.specialty_configs FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.agenda_segmentation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users on agenda_segmentation" ON public.agenda_segmentation FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS no_system_access BOOLEAN DEFAULT false;

