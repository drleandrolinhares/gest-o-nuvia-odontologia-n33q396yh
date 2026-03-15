CREATE TABLE IF NOT EXISTS public.sac_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('RECLAMAÇÃO', 'SUGESTÃO')),
    patient_name TEXT NOT NULL,
    receiving_employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    responsible_employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'RECEBIDO' CHECK (status IN ('RECEBIDO', 'SENDO TRATADO', 'RESOLVIDO')),
    sector TEXT NOT NULL,
    description TEXT NOT NULL,
    solution_details TEXT,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    limit_at TIMESTAMPTZ NOT NULL,
    solved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.sac_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users on sac_records" ON public.sac_records FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS sac_records_status_idx ON public.sac_records(status);
CREATE INDEX IF NOT EXISTS sac_records_received_at_idx ON public.sac_records(received_at);

-- Seed data to prevent empty states
DO $$
DECLARE
    v_emp_id UUID;
BEGIN
    SELECT id INTO v_emp_id FROM public.employees LIMIT 1;

    IF v_emp_id IS NOT NULL THEN
        INSERT INTO public.sac_records (type, patient_name, receiving_employee_id, responsible_employee_id, status, sector, description, limit_at)
        VALUES
        ('RECLAMAÇÃO', 'JOÃO SILVA', v_emp_id, v_emp_id, 'RECEBIDO', 'RECEPÇÃO', 'TEMPO DE ESPERA MUITO LONGO NA RECEPÇÃO DURANTE A TARDE.', NOW() + INTERVAL '24 hours'),
        ('SUGESTÃO', 'MARIA SOUZA', v_emp_id, v_emp_id, 'SENDO TRATADO', 'CLÍNICO', 'GOSTARIA DE OPÇÕES DE MÚSICA AMBIENTE DIFERENTES DURANTE O ATENDIMENTO CLÍNICO.', NOW() + INTERVAL '48 hours');
    END IF;
END $$;
