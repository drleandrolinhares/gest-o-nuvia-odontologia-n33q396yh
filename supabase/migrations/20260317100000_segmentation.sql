ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS no_system_access boolean DEFAULT false;

CREATE TABLE IF NOT EXISTS public.specialty_configs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    color_hex text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agenda_segmentation (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    consultorio_id uuid NOT NULL REFERENCES public.clinica_consultorios(id) ON DELETE CASCADE,
    day_of_week int NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 6),
    shift text NOT NULL CHECK (shift IN ('MANHÃ', 'TARDE')),
    specialty_id uuid REFERENCES public.specialty_configs(id) ON DELETE SET NULL,
    dentist_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(consultorio_id, day_of_week, shift)
);

ALTER TABLE public.specialty_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_segmentation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users on specialty_configs" ON public.specialty_configs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users on agenda_segmentation" ON public.agenda_segmentation
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

