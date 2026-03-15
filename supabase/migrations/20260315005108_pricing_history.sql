CREATE TABLE public.pricing_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    execution_date DATE NOT NULL,
    next_revision_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.pricing_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users" ON public.pricing_history FOR ALL TO authenticated USING (true) WITH CHECK (true);

UPDATE public.app_settings 
SET hourly_cost_fixed_items = '[
    {"id": "1", "name": "PRO-LABORE", "value": 20000},
    {"id": "2", "name": "SALÁRIOS E ENCARGOS", "value": 25000},
    {"id": "3", "name": "MARKETING", "value": 5000},
    {"id": "4", "name": "FUNDO DE RESERVA", "value": 5000},
    {"id": "5", "name": "ALUGUEL E CONDOMÍNIO", "value": 7000},
    {"id": "6", "name": "OUTROS CUSTOS FIXOS", "value": 8841.98}
]'::jsonb;

CREATE OR REPLACE FUNCTION public.handle_pricing_history_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO public.agenda (title, date, time, location, type, is_completed, involves_third_party, created_by)
    VALUES (
        'REVISÃO DE PRECIFICAÇÃO - ' || NEW.user_name,
        NEW.next_revision_date,
        '08:00',
        'SISTEMA',
        'REVISÃO',
        false,
        false,
        'SISTEMA'
    );
    RETURN NEW;
END;
$function$;

CREATE TRIGGER on_pricing_history_created
    AFTER INSERT ON public.pricing_history
    FOR EACH ROW EXECUTE FUNCTION public.handle_pricing_history_insert();

