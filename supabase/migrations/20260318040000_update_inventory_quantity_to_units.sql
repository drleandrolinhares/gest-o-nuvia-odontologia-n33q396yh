-- Convert existing inventory quantity from packages to total units
UPDATE public.inventory
SET quantity = quantity * COALESCE(items_per_box, 1)
WHERE items_per_box > 1;

-- Ensure RLS on inventory
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

DO $ BEGIN
    CREATE POLICY "Allow all authenticated users" ON public.inventory FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $;

-- Ensure RLS on inventory_movements
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

DO $ BEGIN
    CREATE POLICY "Allow all authenticated users" ON public.inventory_movements FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $;

