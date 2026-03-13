ALTER TABLE public.employees
ADD COLUMN IF NOT EXISTS bonus_type text,
ADD COLUMN IF NOT EXISTS bonus_rules text,
ADD COLUMN IF NOT EXISTS bonus_due_date text;

CREATE TABLE IF NOT EXISTS public.bonus_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bonus_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users" ON public.bonus_settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO public.bonus_settings (name) VALUES
('Por comparecimento'),
('Por fechamento')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.employee_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    file_name text NOT NULL,
    file_path text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users" ON public.employee_documents
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

