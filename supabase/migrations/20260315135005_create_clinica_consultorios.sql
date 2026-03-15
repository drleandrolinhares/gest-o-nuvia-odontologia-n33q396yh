CREATE TABLE public.clinica_consultorios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    morning_start TIME,
    morning_end TIME,
    afternoon_start TIME,
    afternoon_end TIME,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.clinica_consultorios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users on clinica_consultorios"
    ON public.clinica_consultorios
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
