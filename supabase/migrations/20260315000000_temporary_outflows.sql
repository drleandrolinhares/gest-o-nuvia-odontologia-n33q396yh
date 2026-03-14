CREATE TABLE IF NOT EXISTS public.inventory_temporary_outflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID NOT NULL REFERENCES public.inventory(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'FINALIZED', 'RETURNED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.inventory_temporary_outflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users" 
ON public.inventory_temporary_outflows 
FOR ALL TO authenticated 
USING (true) WITH CHECK (true);

